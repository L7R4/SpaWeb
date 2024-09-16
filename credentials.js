// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc,getDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5JK2uptY6M6rN3GDfSzxCOkTxbbiW1BY",
  authDomain: "spa-project-46e4c.firebaseapp.com",
  projectId: "spa-project-46e4c",
  storageBucket: "spa-project-46e4c.appspot.com",
  messagingSenderId: "240657526544",
  appId: "1:240657526544:web:2bb8e4945a35021d1c7f95",
  measurementId: "G-2P22V30CLY"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;
export const db = getFirestore(appFirebase);
export const storage = getStorage(appFirebase);


async function getRango(uid){
  const docRef = doc(db, `usuarios/${uid}`);
  const docCifrada = await getDoc(docRef);
  const finalInfo = docCifrada.data().rango;
  return finalInfo;
}


export const onChangeUser = (setUsuario) =>{
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    if(user){
        getRango(user.uid).then((rango)=>{
          const userData = {
            idUser : user.uid,
            emailUser: user.email,
            rangoUser: rango
          }
          setUsuario(userData);   
        })
    }else{
      setUsuario(null);    }
  })
}




