import React, { useState, useEffect } from 'react';
import { db } from '../../../credentials.js';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Noticia from './Noticia';
import FormularioNoticias from './FormularioNoticias';
import Modal from './Modal';
import { Header } from '../Header.jsx';
import { Footer } from '../Footer.jsx';
import  Sidebar  from '../Sidebar/SideBar.jsx';

import useUsuario from '../../hooks/useUsuario';

const Noticias = () => {
  const usuario = useUsuario();
  const [noticias, setNoticias] = useState([]);
  const [editNoticia, setEditNoticia] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const obtenerNoticias = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'noticias'));
      setNoticias(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error al obtener las noticias:', error);
    }
  };

  useEffect(() => {
    obtenerNoticias();
  }, []);

  const eliminarNoticia = async (id) => {
    try {
      await deleteDoc(doc(db, 'noticias', id));
      obtenerNoticias();
    } catch (error) {
      console.error('Error al eliminar la noticia:', error);
    }
  };

  const editarNoticia = (noticia) => {
    setEditNoticia(noticia);
    setIsModalOpen(true);
  };

  const agregarNoticia = () => {
    setEditNoticia(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditNoticia(null);
  };
  console.log(usuario)

  return (
    <div className={usuario ? 'containerLoged' : ''}>
      {/* Mostrar Sidebar si está logueado, si no, el Header */}
      {usuario ? <Sidebar /> : <Header />}
    
      <div className='contenedorPadre-noticias wrapperContent'>
        {usuario && usuario.rangoUser == 'Administrador' && (
          <button className='botonNuevo' onClick={agregarNoticia}>Agregar Noticia</button>
        )}

        {noticias.length > 0 ? (
          noticias.map(noticia => (
            <Noticia
              key={noticia.id}
              noticia={noticia}
              onDelete={eliminarNoticia}
              onEdit={editarNoticia}
              user={usuario}
            />
          ))
        ) : (
          <p>No hay noticias disponibles.</p>
        )}
        {isModalOpen && (
          <Modal closeModal={closeModal}>
            <FormularioNoticias
              noticia={editNoticia}
              closeModal={closeModal}
              refreshNoticias={obtenerNoticias}
            />
          </Modal>
        )}
      </div>
      
      {/* Mostrar Footer solo si no está logueado */}
      {!usuario && <Footer />}

    </div>
  );
};

export default Noticias;
