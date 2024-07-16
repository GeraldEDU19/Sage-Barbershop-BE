import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import util from 'util';
import uploadFileMiddleware from '../middleware/upload';

const uploadFile = util.promisify(uploadFileMiddleware);

// Subir archivo
export const upload = async (req: Request, res: Response): Promise<void> => {
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      res.status(400).send({ message: '¡Por favor sube un archivo!' });
      return;
    }

    res.status(200).send({ message: req.file.originalname });
  } catch (err) {
    if (err instanceof Error && err.message === 'LIMIT_FILE_SIZE') {
      res.status(500).send({ message: '¡El tamaño del archivo no puede ser mayor a 2 MB!' });
      return;
    }

    res.status(500).send({
      message: `No se pudo cargar el archivo: ${req.file?.originalname}. ${err instanceof Error ? err.message : err}`
    });
  }
};

// Listar archivos
export const getListFiles = (req: Request, res: Response): void => {
  const directoryPath = path.join(__dirname, '../../assets/uploads/');

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      res.status(500).send({ message: '¡No se pueden escanear los archivos!' });
      return;
    }

    const fileInfos = files.map(file => ({
      name: file,
      url: `${req.protocol}://${req.get('host')}/files/${file}`,
    }));

    res.status(200).send(fileInfos);
  });
};

// Descargar archivo
export const download = (req: Request, res: Response): void => {
  const fileName = req.params.name;
  const directoryPath = path.join(__dirname, '../../assets/uploads/');

  res.download(path.join(directoryPath, fileName), fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: `No se pudo descargar el archivo. ${err instanceof Error ? err.message : err}`,
      });
    }
  });
};
