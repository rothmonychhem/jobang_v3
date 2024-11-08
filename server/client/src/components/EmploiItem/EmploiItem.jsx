import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./EmploiItem.css";
import { useEmploiContext } from "../../hooks/useEmploiContext";
import { useCandidatContext } from "../../hooks/useCandidatContext";

const EmploiItem = ({ searchTerm, location, likedJobs, setLikedJobs }) => {
  const [showEmail, setShowEmail] = useState(false);
  const [selectedEmploi, setSelectedEmploi] = useState(null); // Track selected emploi for details
  const { emplois, dispatch } = useEmploiContext();
  const { candidat } = useCandidatContext();

  useEffect(() => {
    const fetchEmploi = async () => {
      try {
        const response = await fetch('/api/offreEmploi', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${candidat.token}`
          }
        });
        const json = await response.json();
        if (response.ok) {
          dispatch({ type: 'SET_EMPLOIS', payload: json });
        } else {
          console.error('Error fetching emplois:', json);
        }
      } catch (error) {
        console.error('Error fetching emplois:', error);
      }
    };

    if (candidat && candidat.token) {
      fetchEmploi();
    }
  }, [dispatch, candidat]);

  const emploisList = emplois || [];
  const filteredEmplois = emploisList.filter(emploi => {
    return (
      emploi.visibility === true &&
      (emploi.nom_poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emploi.nom_candidat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emploi.categorie.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emploi.description && emploi.description.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (location === "" || emploi.emplacement.toLowerCase().includes(location.toLowerCase()))
    );
  });

  const toggleDetails = (emploi) => {
    setSelectedEmploi((prevEmploi) => (prevEmploi === emploi ? null : emploi));
  };

  return (
    <div>
      <ul className="lmj-emploi-list">
        {filteredEmplois.length > 0 ? (
          filteredEmplois.map((emploi) => (
            <div className="emploi-container" key={emploi.nom_poste}>
              <div
                className="like-icon"
                onClick={() => {
                  const newLikes = new Set(likedJobs);
                  if (newLikes.has(emploi.nom_poste)) {
                    newLikes.delete(emploi.nom_poste);
                  } else {
                    newLikes.add(emploi.nom_poste);
                  }
                  setLikedJobs(newLikes);
                }}
                style={{ cursor: "pointer" }}
              >
                {likedJobs.has(emploi.nom_poste) ? (
                  <FaHeart color="black" />
                ) : (
                  <FaRegHeart color="black" />
                )}
              </div>

              <h3
                className="jobTitle"
                onClick={() => toggleDetails(emploi)}
                style={{ cursor: "pointer" }}
              >
                {emploi.nom_poste}
              </h3>
              <span className="jobCandidat">
                <span className="label">Candidat:</span> {emploi.nom_candidat}
              </span>
              <span className="jobSector">
                <span className="label">Secteur:</span> {emploi.categorie}
              </span>
              <span className="jobSalary">
                <span className="label">Salaire:</span> {emploi.salaire}
              </span>
              <span className="jobLocation">
                <span className="label">Emplacement:</span> {emploi.emplacement}
              </span>

              <button className="buttonP" onClick={() => setShowEmail((prev) => prev === emploi ? null : emploi)}>
                Postuler
              </button>

              {showEmail === emploi && (
                <div className="popup">
                  <div className="popup-content">
                    <span className="close" onClick={() => setShowEmail(null)}>
                      &times;
                    </span>
                    <h4>Email: <a href={`mailto:${emploi.email_employeur}`}>{emploi.email_employeur}</a></h4>
                  </div>
                </div>
              )}

              {selectedEmploi === emploi && (
                <div className="details-popup">
                  <div className="details-popup-content">
                    <span className="close" onClick={() => toggleDetails(emploi)}>
                      &times;
                    </span>
                    <div className="details-content">
                      <h4>Description:</h4>
                      <p>{emploi.description}</p>
                      <h4>Responsabilités:</h4>
                      <p>{emploi.responsabilite}</p>
                      <h4>Exigences:</h4>
                      <p>{emploi.exigence}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <li>Aucune offre d'emploi trouvée.</li>
        )}
      </ul>
    </div>
  );
};

export default EmploiItem;
