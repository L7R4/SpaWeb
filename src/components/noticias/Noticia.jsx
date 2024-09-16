import React, { useState, useEffect } from 'react';
import { db } from '../../../credentials';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import useUsuario from '../../hooks/useUsuario';
import iconUser from 'icons/user_icon.png';



const Noticia = ({ noticia, onDelete, onEdit, user }) => {
  const usuario = useUsuario();
  const { id, title, description, imageUrl } = noticia;
  const [newComment, setNewComment] = useState('');
  const [comentarios, setComentarios] = useState([]);

  const getUser = async (uid) => {
    const userDocRef = doc(db, "usuarios", uid);
    const userDocSnap = await getDoc(userDocRef);
    return userDocSnap.data();
  }
  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const noticiaRef = doc(db, 'noticias', id);

        let nombreUsuario = "Usuario anónimo";
        // Buscar el usuario en la colección "usuarios" por su UID
        if (user) {
          const usuarioFound = await getUser(user.idUser);
          nombreUsuario = usuarioFound.nombreCompleto;
        }

        // Crear el nuevo comentario
        const nuevoComentario = {
          usuario: nombreUsuario,
          comentario: newComment,
        };

        // Actualizar la base de datos
        await updateDoc(noticiaRef, {
          comentarios: arrayUnion(nuevoComentario)
        });

        setComentarios(prevComentarios => [...prevComentarios, nuevoComentario]);
        setNewComment('');

      } catch (error) {
        console.error('Error al agregar comentario:', error);
      }
    }
  };
  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const noticiaRef = doc(db, 'noticias', id);
        const noticiaDoc = await getDoc(noticiaRef);
        const { comentarios = [] } = noticiaDoc.data();
        setComentarios(comentarios);

      } catch (error) {
        console.error('Error al obtener comentarios:', error);
      }
    };

    fetchComentarios();
  }, [id]);

  return (
    <div className="noticia-card">
      <h3>{title}</h3>
      <div className='noticia-contenido'>
        <p>{description}</p>
        {imageUrl && <img src={imageUrl} alt={title} />}
      </div>
      <h2 className='h2-comentarios'>Comentarios</h2>
      <div className='comentarios-container'>
        {comentarios.length > 0 ? (
          comentarios.map((comentario, index) => (
            <div key={index} className='comentario'>
              <img src={iconUser} alt='Avatar' />
              <div className='comentario-texto'>
                <h5>{comentario.usuario}</h5>
                <p>{comentario.comentario}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No hay comentarios.</p>
        )}
      </div>
      <div className='comentario-input'>
        <input
          type='text'
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder='Escribe tu comentario...'
        />
        <button onClick={handleAddComment}>
          <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 512 512">
            <path
              d="M307 34.8c-11.5 5.1-19 16.6-19 29.2l0 64-112 0C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96l96 0 0 64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z"
              fill="#00584A"
            />
          </svg>
        </button>
      </div>
      {usuario && usuario.rangoUser === 'Administrador' && (
        <div className="noticia-actions">
          <button className="button" onClick={() => onEdit(noticia)}>Editar</button>
          <button className="button" onClick={() => onDelete(id)}>Eliminar</button>
        </div>
      )}
    </div>
  );
};

export default Noticia;
