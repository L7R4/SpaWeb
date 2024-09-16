import React, { useState, useEffect } from 'react';
import { db, storage } from '../../../credentials';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const FormularioNoticias = ({ noticia, closeModal, refreshNoticias }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (noticia) {
      setTitle(noticia.title);
      setDescription(noticia.description);
    } else {
      setTitle('');
      setDescription('');
      setImage(null);
    }
  }, [noticia]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = '';

    if (image) {
      const storageRef = ref(storage, `images/${Date.now()}_${image.name}`);
      await uploadBytes(storageRef, image);
      imageUrl = await getDownloadURL(storageRef);
    }

    if (noticia) {
      const noticiaRef = doc(db, 'noticias', noticia.id);
      await updateDoc(noticiaRef, { title, description, imageUrl });
    } else {
      await addDoc(collection(db, 'noticias'), { title, description, imageUrl });
    }

    closeModal();
    refreshNoticias();
  };

  return (
    <form onSubmit={handleSubmit} className='formulario-noticias'>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción"
        required
      />
      <label className="custom-file-upload">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
        Seleccionar Imagen
      </label>
      <div className='form-footer'>
        <button className='button' type="submit">{noticia ? 'Guardar' : 'Agregar Noticia'}</button>
      </div>
      <button className='close-btn' type="button" onClick={closeModal}>x</button>
    </form>
  );
};

export default FormularioNoticias;
