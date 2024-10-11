import React from 'react';
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import MisAdopciones from './MisAdopciones.jsx';
import MisSolicitudesMascotas from './MisSolicitudesMascotas.jsx';
import Header from '../moleculas/Header.jsx';

const TabAdopciones = () => {
    return (
        <div className='bg-[#EAEDF6] min-h-screen h-full'>
            <Header title="Adopciones" />
            <div className='bg-[#EAEDF6] flex flex-col items-center'>
                <div className='w-full max-w-[95%] p-6 flex-grow'>
                    <div className="flex flex-col gap-6 w-full h-full bg-[#EAEDF6] pl-16">
                        <Tabs aria-label="Options"  color="default" variant="bordered">
                            <Tab key="misSoli" title="Mis Solicitudes Mascotas">
                                <Card className="h-full">
                                    <CardBody className="flex justify-center items-center">
                                        <MisSolicitudesMascotas />
                                    </CardBody>
                                </Card>
                            </Tab>
                            <Tab key="misAdopciones" title="Mis Adopciones">
                                <Card className="h-full">
                                    <CardBody className="flex justify-center items-center">
                                        <MisAdopciones />
                                    </CardBody>
                                </Card>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default TabAdopciones;
