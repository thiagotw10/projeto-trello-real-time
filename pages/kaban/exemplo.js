import React, { useState } from 'react';
import styles from "@/styles/kaban.module.css";


const FormAgendar = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para lidar com o envio do formulário
    console.log(formData);
    // Limpar os campos do formulário
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <div className={styles.modal}>
        <form onSubmit={handleSubmit} className={styles.formmodal}>
          <div>
            <label htmlFor="name">Nome:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="email">E-mail:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="message">Mensagem:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Enviar</button>
        </form>
    </div>
  );
};

export default FormAgendar;