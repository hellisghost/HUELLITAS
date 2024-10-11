import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Modal as RNModal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axiosClient from '../client/axiosClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Tooltip } from 'react-native-elements';

const ListPet = ({ visible, onClose, pet, refreshPets }) => {
  const navigation = useNavigation();
  const [vacunas, setVacunas] = useState([]);
  const [isGuest, setIsGuest] = useState(false);
  const imagesArray = pet && pet.imagenes ? pet.imagenes.split(',') : [];
  const [mainImage, setMainImage] = useState(
    imagesArray.length > 0
      ? `${axiosClient.defaults.baseURL}/uploads/${imagesArray[0]}`
      : 'https://nextui.org/images/hero-card-complete.jpeg'
  );

  useEffect(() => {
    if (pet && pet.imagenes) {
      const imagesArray = typeof pet.imagenes === 'string' ? pet.imagenes.split(',') : pet.imagenes;
      if (Array.isArray(imagesArray) && imagesArray.length > 0) {
        setMainImage(`${axiosClient.defaults.baseURL}/uploads/${imagesArray[0]}`);
      } else {
        setMainImage('https://nextui.org/images/hero-card-complete.jpeg');
      }
    } else {
      setMainImage('https://nextui.org/images/hero-card-complete.jpeg');
    }
  }, [pet]);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        const parsedUser = user ? JSON.parse(user) : null;
        if (!parsedUser || parsedUser.rol === 'invitado') {
          setIsGuest(true);
        }
      } catch (error) {
        console.error('Error al verificar el rol del usuario:', error);
      }
    };
    checkUserRole();
  }, []);

  useEffect(() => {
    const fetchVacunas = async () => {
      if (!pet || !pet.id_mascota) {
        console.error('No se encontró id_mascota en la mascota seleccionada.');
        return;
      }
      try {
        const response = await axiosClient.get(`/vacunas/listarVacunasAsociadaAMascota/${pet.id_mascota}`);
        setVacunas(response.data);
        console.log("Datos de la vacuna de la mascota: ", response.data);
      } catch (error) {
        console.error('Error al listar vacunas:', error);
      }
    };

    if (pet && pet.id_mascota) {
      fetchVacunas();
    }
  }, [pet]);

  const handleAdoptar = async () => {
    if (isGuest) {
      Alert.alert(
        'Advertencia',
        'Debes Iniciar sesión para adoptar una mascota.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ok', onPress: () => navigation.navigate('Inicio') }
        ]
      );
      return;
    }
    try {
      const user = await AsyncStorage.getItem('user');
      const parsedUser = user ? JSON.parse(user) : null;
      const id_usuario = parsedUser ? parsedUser.id_usuario : null;

      const response = await axiosClient.post(`/adopciones/iniciar/${pet.id_mascota}`, { id_usuario });
      if (response.status === 200) {
        Alert.alert('Éxito', 'Mascota puesta en proceso de adopción');
        if (refreshPets) refreshPets();
        onClose();
      } else {
        Alert.alert('Error', 'Error al poner en proceso de adopción');
      }
    } catch (error) {
      console.error('Error al iniciar adopción:', error);
      Alert.alert('Error', 'Error al poner en proceso de adopción');
    }
  };

  if (!pet) {
    return;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let ageYears = today.getFullYear() - birth.getFullYear();
    let ageMonths = today.getMonth() - birth.getMonth();

    if (ageMonths < 0) {
      ageYears--;
      ageMonths += 12;
    }
    if (today.getDate() < birth.getDate()) {
      ageMonths--;
      if (ageMonths < 0) {
        ageYears--;
        ageMonths += 12;
      }
    }
    return { years: ageYears, months: ageMonths };
  };

  const { years, months } = calculateAge(pet.fecha_nacimiento);

  return (
    <RNModal visible={visible} onRequestClose={onClose} transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.petInfoContainer}>
              <Image source={{ uri: mainImage }} style={styles.petImage} />
              <View style={styles.headerInfo}>
                <Text style={styles.petName}>{pet.nombre_mascota}</Text>
                <Text style={styles.location}>
                  <Icon name="place" size={16} color="black" /> {pet.municipio || 'Ubicación desconocida'}
                </Text>
                <View style={styles.adoptionStatusContainer}>
                  <Text style={styles.adoptionStatus}>
                    {pet.estado === 'En Adopcion' || pet.estado === 'Urgente' ? 'En Adopción' : 'Estado no disponible'}
                  </Text>
                  <Icon name="star" size={20} color="black" />
                </View>
              </View>
            </View>

            {imagesArray.length > 0 && (
              <View style={styles.photosContainer}>
                <Text style={styles.morePhotosText}>Fotos</Text>
                <ScrollView horizontal>
                  {imagesArray.map((image, index) => (
                    <TouchableOpacity key={index} onPress={() => setMainImage(`${axiosClient.defaults.baseURL}/uploads/${image}`)}>
                      <Image source={{ uri: `${axiosClient.defaults.baseURL}/uploads/${image}` }} style={styles.smallImage} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={styles.detailsContainer}>
              <Text style={styles.sectionTitle}>Mis datos</Text>
              <View style={styles.detailsGrid}>
                <View style={styles.detailsColumn}>
                  <Tooltip
                    popover={<Text>Raza del mascota</Text>}
                    containerStyle={styles.tooltipContainer}
                    pointerColor="black"
                  >
                    <View style={styles.dataRow}>
                      <Icon name="pets" size={20} color="black" />
                      <Text style={styles.dataText}>{pet.raza}</Text>
                    </View>
                  </Tooltip>

                  <Tooltip
                    popover={<Text>Edad de la mascota</Text>}
                    containerStyle={styles.tooltipContainer}
                    pointerColor="black"
                  >
                    <View style={styles.dataRow}>
                      <Icon name="calendar-today" size={20} color="black" />
                      <Text style={styles.dataText}>{years} Años y {months} Meses</Text>
                    </View>
                  </Tooltip>

                  <Tooltip
                    popover={<Text>Peso de la mascota</Text>}
                    containerStyle={styles.tooltipContainer}
                    pointerColor="black"
                  >
                    <View style={styles.dataRow}>
                      <Icon name="fitness-center" size={20} color="black" />
                      <Text style={styles.dataText}>{pet.peso} kg</Text>
                    </View>
                  </Tooltip>

                  <Tooltip
                    popover={<Text>Departamento de la mascota</Text>}
                    containerStyle={styles.tooltipContainer}
                    pointerColor="black"
                  >
                    <View style={styles.dataRow}>
                      <Icon name="place" size={20} color="black" />
                      <Text style={styles.dataText}>{pet.departamento}</Text>
                    </View>
                  </Tooltip>
                </View>

                <View style={styles.detailsColumn}>
                  <Tooltip
                    popover={<Text>Sexo de la mascota</Text>}
                    containerStyle={styles.tooltipContainer}
                    pointerColor="black"
                  >
                    <View style={styles.dataRow}>
                      <Icon
                        name={pet.sexo === 'Macho' ? 'male' : 'female'}
                        size={20}
                        color={pet.sexo === 'Macho' ? '#00BFFF' : '#FF69B4'}
                        style={styles.genderIcon}
                      />
                      <Text style={styles.dataText}>{pet.sexo}</Text>
                    </View>
                  </Tooltip>

                  <Tooltip
                    popover={<Text>Estado de esterilización de la mascota</Text>}
                    containerStyle={styles.tooltipContainer}
                    pointerColor="black"
                  >
                    <View style={styles.dataRow}>
                      <Icon name="healing" size={20} color="black" />
                      <Text style={styles.dataText}>{pet.esterilizado ? 'Esterilizado' : 'No esterilizado'}</Text>
                    </View>
                  </Tooltip>

                  <Tooltip
                    popover={<Text>Fecha de registro de la mascota</Text>}
                    containerStyle={styles.tooltipContainer}
                    pointerColor="black"
                  >
                    <View style={styles.dataRow}>
                      <Icon name="event" size={20} color="black" />
                      <Text style={styles.dataText}>{formatDate(pet.fecha_registro)}</Text>
                    </View>
                  </Tooltip>
                </View>
              </View>

              <View style={styles.vaccinesContainer}>
                <Text style={styles.sectionTitle}>Vacunas</Text>
                {vacunas.length > 0 ? (
                  vacunas.map((vacuna, index) => (
                    <Text key={index} style={styles.vaccineText}>
                      {vacuna.nombre_vacuna} - {vacuna.fecha}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.vaccineText}>No hay vacunas registradas</Text>
                )}
              </View>
            </View>

            {(pet.estado !== 'Adoptado' && pet.estado !== 'Reservado' && pet.estado === 'En Adopcion') && (
              <TouchableOpacity style={[styles.button, styles.adoptButton]} onPress={handleAdoptar}>
                <Text style={styles.buttonText}>¡Adóptame!</Text>
              </TouchableOpacity>
            )}


            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={28} color="white" />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    maxHeight: '90%',
    position: 'relative',
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  petInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  petImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  headerInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  location: {
    fontSize: 16,
    color: '#000',
    marginVertical: 5,
  },
  adoptionStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adoptionStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
    marginRight: 5,
  },
  photosContainer: {
    marginVertical: 20,
  },
  morePhotosText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  smallImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsColumn: {
    flex: 1,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dataText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  vacunaRowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vacunaContainer: {
    width: '48%',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#000',
  },
  noVacunasText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  adoptButton: {
    backgroundColor: 'black',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF5A5F',
    borderRadius: 15,
    padding: 5,
  },
});

export default ListPet;
