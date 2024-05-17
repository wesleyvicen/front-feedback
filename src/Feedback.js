import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import './App.css';

const socket = io('http://localhost:8080');

function Feedback() {
  const [step, setStep] = useState(1); // Controle dos passos
  const [rating, setRating] = useState(null);
  const [found, setFound] = useState(null);
  const [votingStarted, setVotingStarted] = useState(false);
  const [employee, setEmployee] = useState(''); // Para armazenar o nome do funcionário
  const [isSubmitting, setIsSubmitting] = useState(false); // Controle do estado de envio
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('startVoting', (message) => {
      setVotingStarted(true);
      setEmployee(message.employee); // Define o funcionário que iniciou a votação
      console.log(message);
    });

    return () => {
      socket.off('startVoting');
    };
  }, []);

  const handleRatingSubmit = (rating) => {
    if (isSubmitting) return; // Verifica se já está enviando
    setRating(rating);
    setStep(2); // Avança para a próxima pergunta
  };

  const handleFoundSubmit = (found) => {
    if (isSubmitting) return; // Verifica se já está enviando
    setFound(found);
    submitFeedback(rating, found);
  };

  const submitFeedback = (rating, found) => {
    setIsSubmitting(true); // Define o estado de envio como true
    fetch('http://localhost:8080/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rating, found, employee }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(() => {
      setStep(3); // Exibe a mensagem final
      setTimeout(() => {
        setVotingStarted(false); // Reinicia o estado de votação
        setStep(1); // Reinicia o passo para a primeira pergunta
        navigate('/'); // Redireciona para a tela inicial após 3 segundos
      }, 3000);
    })
    .catch(error => {
      console.error('Error:', error);
    })
    .finally(() => {
      setIsSubmitting(false); // Redefine o estado de envio como false
    });
  };

  return (
    <div className="container">
      {votingStarted ? (
        <>
          <h2>Iniciado por: {employee}</h2> {/* Exibe o nome do funcionário */}
          {step === 1 && (
            <>
              <h1>Como você avalia o nosso atendimento?</h1>
              <div className="rating">
                <button 
                  className="pessimo" 
                  onClick={() => handleRatingSubmit('Péssimo')}
                  disabled={isSubmitting} // Desativa o botão durante o envio
                >
                  <i className="fas fa-sad-tear"></i><br />Péssimo
                </button>
                <button 
                  className="ruim" 
                  onClick={() => handleRatingSubmit('Ruim')}
                  disabled={isSubmitting} // Desativa o botão durante o envio
                >
                  <i className="fas fa-frown"></i><br />Ruim
                </button>
                <button 
                  className="mediano" 
                  onClick={() => handleRatingSubmit('Mediano')}
                  disabled={isSubmitting} // Desativa o botão durante o envio
                >
                  <i className="fas fa-meh"></i><br />Mediano
                </button>
                <button 
                  className="bom" 
                  onClick={() => handleRatingSubmit('Bom')}
                  disabled={isSubmitting} // Desativa o botão durante o envio
                >
                  <i className="fas fa-smile"></i><br />Bom
                </button>
                <button 
                  className="otimo" 
                  onClick={() => handleRatingSubmit('Ótimo')}
                  disabled={isSubmitting} // Desativa o botão durante o envio
                >
                  <i className="fas fa-laugh-beam"></i><br />Ótimo
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1>Encontrou tudo que procurava?</h1>
              <div className="found">
                <button 
                  className="nao" 
                  onClick={() => handleFoundSubmit('Não')}
                  disabled={isSubmitting} // Desativa o botão durante o envio
                >
                  <i className="fas fa-times-circle"></i><br />Não
                </button>
                <button 
                  className="sim" 
                  onClick={() => handleFoundSubmit('Sim')}
                  disabled={isSubmitting} // Desativa o botão durante o envio
                >
                  <i className="fas fa-check-circle"></i><br />Sim
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <h1>Obrigado pelo seu feedback! Volte sempre!</h1>
          )}
        </>
      ) : (
        <h1>Aguarde, o feedback será liberado em breve...</h1>
      )}
    </div>
  );
}

export default Feedback;
