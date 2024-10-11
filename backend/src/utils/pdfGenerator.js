import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Función para formatear las fechas
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// Función para calcular la edad en meses
const calculateAgeInMonths = (birthdate) => {
    const birth = new Date(birthdate);
    const now = new Date();

    const years = now.getFullYear() - birth.getFullYear();
    const months = now.getMonth() - birth.getMonth();

    return years * 12 + months;
};

export const generatePDF = async (mascota) => {
    const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 60, left: 50, right: 50, bottom: 60 },
        info: {
            Title: `Ficha Técnica - ${mascota.nombre_mascota}`,
            Author: 'Tu Aplicación',
        }
    });

    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    // Logo en la parte superior
    const logoPath = path.resolve('uploads/img-1723413097559-796545287.png');
    if (fs.existsSync(logoPath)) {
        doc.image(logoPath, doc.page.width / 5 - 40, 50, { width: 80, height: 80 }); // Logo centrado
    }

    // Imagen de la mascota centrada en la parte superior
    const mascotaImagePath = path.resolve('uploads', mascota.imagen);
    if (fs.existsSync(mascotaImagePath)) {
        doc.image(mascotaImagePath, {
            fit: [200, 200],
            align: 'center',
            valign: 'center',
            x: doc.page.width / 2 - 100, // Centra la imagen de la mascota horizontalmente
            y: 150 // Justo debajo del logo
        });
    }

    // Dejar espacio debajo de la imagen antes del texto
    doc.moveDown(6);

    // Título principal centrado
    doc
        .fontSize(24)
        .font('Helvetica-Bold')
        .fillColor('#2C3E50')
        .text('Ficha Técnica de la Mascota', {
            align: 'center',
            underline: true,
        })
        .moveDown(7);

    // Información detallada
    doc
        .fontSize(18)
        .font('Helvetica-Bold')
        .fillColor('#2C3E50')
        .text(`Nombre:`, { continued: true })
        .font('Helvetica')
        .fillColor('#34495E')
        .text(` ${mascota.nombre_mascota}`)
        .moveDown(0.5);

    doc
        .font('Helvetica-Bold')
        .text(`Fecha de Nacimiento:`, { continued: true })
        .font('Helvetica')
        .text(` ${formatDate(mascota.fecha_nacimiento)}`)
        .moveDown(0.5);

    doc
        .font('Helvetica-Bold')
        .text(`Edad:`, { continued: true })
        .font('Helvetica')
        .text(` ${calculateAgeInMonths(mascota.fecha_nacimiento)} meses`)
        .moveDown(0.5);

    doc
        .font('Helvetica-Bold')
        .text(`Estado:`, { continued: true })
        .font('Helvetica')
        .text(` ${mascota.estado}`)
        .moveDown(0.5);

    // Vacunas
    doc
        .moveDown(1)
        .font('Helvetica-Bold')
        .fontSize(18)
        .fillColor('#2C3E50')
        .text('Vacunas', { underline: true });

    mascota.vacunas.forEach(vacuna => {
        doc
            .fontSize(14)
            .font('Helvetica')
            .fillColor('#34495E')
            .text(`- ${vacuna.enfermedad} (${formatDate(vacuna.fecha_vacuna)}): ${vacuna.estado}`)
            .moveDown(0.2);
    });

    // Descripción
    doc
        .moveDown(1)
        .font('Helvetica-Bold')
        .fontSize(18)
        .fillColor('#2C3E50')
        .text('Descripción', { underline: true })
        .moveDown(0.5);

    doc
        .font('Helvetica')
        .fontSize(14)
        .fillColor('#34495E')
        .text(mascota.descripcion, {
            align: 'justify'
        })
        .moveDown(9);

    // Pie de página
    doc
        .fontSize(10)
        .fillColor('#7F8C8D')
        .text('Generado por Huellitas ©', {
            align: 'center',
            baseline: 'bottom'
        });

    doc.end();

    return new Promise((resolve, reject) => {
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });
        doc.on('error', reject);
    });
};
