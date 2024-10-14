import React from 'react';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';
import { SliderCard } from './SliderCard.jsx';
import  Sidebar  from './Sidebar/SideBar.jsx';


export function Layout() {

    return (
        <>
            <Sidebar/>
            
            <div className="wrapperMain">

                <main className="seccion-home">
                    <div className="seccion-home-contenedor">
                        <h2 className="seccion-home-titulo">Spa & Beauty</h2>
                        <p className="seccion-home-parrafo">Bienvenidos a Sentirse Bien. Nuestro <b>objetivo</b> cuidar de tu bienestar con tratamientos personalizados que despiertan tus sentidos y te desconectan de la rutina diaria. Buscamos que cada visita sea un momento único de relajación en armonía con la naturaleza. ¡Explora nuestros servicios y reserva tu turno fácilmente!
                        </p>
                    </div>
                </main>

                <section className="seccion-quienesSomos">
                    <img src="../src/assets/imagenRelax.svg" />
                    <div className="seccion-quienesSomos-contenedor">
                        <h2 className="seccion-quienesSomos-titulo">¿Quienes Somos?</h2>
                        <p className="seccion-quienesSomos-parrafo">Somos un equipo de profesionales altamente capacitados que comparten la pasión por el bienestar integral. Guiados por la Dra. Ana Felicidad, nuestra <b>visión</b> es ofrecerte una experiencia personalizada y única. Cada miembro de nuestro equipo está comprometido con brindarte un trato cálido, asegurándose de que cada detalle contribuya a tu bienestar físico y emocional. ¡Tu relajación y cuidado están en las mejores manos!
                        </p>
                    </div>
                </section>

                <section className="seccion-servicios">
                    <h2 className="seccion-servicios-titulo">Servicios</h2>
                    <SliderCard />
                </section>

                {/* <section className="seccion-video">
                    <iframe className="video-frame" width="640" height="360" src="https://drive.google.com/file/d/1bCD7kdVtXRObkH9arXYTfKYW0gbXJzk2/preview"
                        title="Video en Spa" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true}>
                    </iframe>
                </section> */}

                <section className="seccion-ubicacion">
                    <h2 className="seccion-ubicacion-titulo">¿Donde encontrarnos?</h2>
                    <div className="seccion-ubicacion-contenedor">
                        <div className="ubicacion-contenedor">
                            <iframe
                                title="Ubicación"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093743!2d144.9537353153168!3d-37.8162792797517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf5774e6f5a3b9d1d!2sFederation%20Square!5e0!3m2!1sen!2sau!4v1603086219011!5m2!1sen!2sau"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                style={{ border: 0, borderRadius: "8px" }}
                                allowFullScreen={false}
                                aria-hidden="false"
                                tabIndex={0}
                            ></iframe>
                        </div>
                        <div className="ubicacion-parrafo-contenedor">
                            <p className="seccion-ubicacion-parrafo">De Lunes a Sábado: De 8:30 a 12:30hs y de 16:00 a 20:00hs</p>
                        </div>
                    </div>
                </section>

            </div>
            <Footer />
        </>
    );
}