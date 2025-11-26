// src/pages/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { toast } from 'react-toastify';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    try {
      // Chama a função de login que faz a requisição para o Django
      await login(username, password);

      toast.success('Login realizado com sucesso!');

      // Redireciona o usuário para o painel principal (ex: lista de alunos)
      navigate('/alunos');
    } catch (error) {
      console.error('Erro de Login:', error);
      toast.error('Usuário ou senha inválidos.');
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '50px auto',
        padding: '20px',
        border: '1px solid #ccc',
      }}
    >
      <h2>Acesso Restrito</h2>
      <form
        onSubmit={handleLogin}
        style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
      >
        <label>Usuário:</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

        <label>Senha:</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          style={{ padding: '10px', background: '#007bff', color: 'white' }}
        >
          Entrar
        </button>
      </form>
      <p style={{ marginTop: '10px', textAlign: 'center' }}>
        Use o usuário admin que você criou via **createsuperuser**.
      </p>
    </div>
  );
};

export default Login;
