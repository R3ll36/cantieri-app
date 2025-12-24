import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { parseMapLink, reverseGeocode, generateGoogleMapsLink } from '../utils/mapsLinkParser';
import { uploadMultipleMedia, validateMediaFile } from '../firebase/storage';

/**
 * Form per creare/modificare cantiere
 * @param {Object} props
 * @param {Object} props.initialData - Dati iniziali (per edit)
 * @param {Object} props.initialCoordinates - Coordinate iniziali {lat, lng}
 * @param {Function} props.onSubmit - Callback submit form
 * @param {Function} props.onCancel - Callback annulla
 * @param {boolean} props.isLoading - Stato loading
 */
export default function CantiereForm({
  initialData = null,
  initialCoordinates = null,
  onSubmit,
  onCancel,
  isLoading = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      nome: '',
      indirizzo: '',
      cliente: '',
      tipologia: 'Residenziale',
      note_operative: '',
      orari: '7:00-18:00',
      difficolta: 'Medio',
      stato: 'Attivo',
      data_inizio: new Date().toISOString().split('T')[0],
      data_fine_prevista: '',
      coordinatore_nome: '',
      coordinatore_telefono: '',
      metri_cubi_oggi: 0,
      metri_cubi_precedenti: 0,
    },
  });

  const [coordinates, setCoordinates] = useState(
    initialData?.coordinate || initialCoordinates || null
  );
  const [mapsLink, setMapsLink] = useState('');
  const [parsedAddress, setParsedAddress] = useState('');
  const [isParsingLink, setIsParsingLink] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Se ci sono coordinate iniziali, genera link Maps e cerca indirizzo
  useEffect(() => {
    if (coordinates && !initialData) {
      const link = generateGoogleMapsLink(coordinates.lat, coordinates.lng);
      setMapsLink(link);
      setValue('maps_link', link);

      // Reverse geocoding per ottenere indirizzo
      reverseGeocode(coordinates.lat, coordinates.lng).then((result) => {
        if (result.success) {
          setParsedAddress(result.address);
          if (!watch('indirizzo')) {
            setValue('indirizzo', result.address);
          }
        }
      });
    }
  }, [coordinates, initialData, setValue, watch]);

  // Parsing link Maps inserito manualmente
  const handleParseMapsLink = async () => {
    const link = watch('maps_link_input');
    if (!link) {
      alert('Inserisci un link Google/Apple Maps');
      return;
    }

    setIsParsingLink(true);
    const result = await parseMapLink(link);
    setIsParsingLink(false);

    if (result.success) {
      const coords = { lat: result.lat, lng: result.lng };
      setCoordinates(coords);
      setValue('coordinate', coords);
      setMapsLink(generateGoogleMapsLink(result.lat, result.lng));
      setValue('maps_link', generateGoogleMapsLink(result.lat, result.lng));

      // Reverse geocoding
      const addressResult = await reverseGeocode(result.lat, result.lng);
      if (addressResult.success) {
        setParsedAddress(addressResult.address);
        if (!watch('indirizzo')) {
          setValue('indirizzo', addressResult.address);
        }
      }

      alert('✅ Coordinate estratte con successo!');
    } else {
      alert(`❌ Errore: ${result.error}`);
    }
  };

  // Gestione selezione file
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    // Valida ogni file
    const validFiles = [];
    for (const file of files) {
      const validation = validateMediaFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        alert(`File "${file.name}" non valido: ${validation.error}`);
      }
    }

    // Max 5 file totali (tra nuovi e già selezionati)
    const totalFiles = [...selectedFiles, ...validFiles];
    if (totalFiles.length > 5) {
      alert('Massimo 5 foto/video per cantiere');
      setSelectedFiles(totalFiles.slice(0, 5));
    } else {
      setSelectedFiles(totalFiles);
    }
  };

  // Rimuovi file selezionato
  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit form
  const onSubmitForm = async (data) => {
    // Verifica coordinate
    if (!coordinates) {
      alert('Inserisci coordinate del cantiere (da link Maps o click su mappa)');
      return;
    }

    // Upload foto se presenti
    let fotoUrls = initialData?.foto_urls || [];
    if (selectedFiles.length > 0) {
      setUploadProgress(0);
      // Genera ID temporaneo per cartella (se nuovo cantiere)
      const tempId = initialData?.id || `temp_${Date.now()}`;

      const uploadResult = await uploadMultipleMedia(selectedFiles, tempId, 'originali');

      if (uploadResult.success) {
        fotoUrls = [...fotoUrls, ...uploadResult.urls];
        setUploadProgress(100);
      } else {
        alert(`Errore upload foto: ${uploadResult.error}`);
        return;
      }
    }

    // Prepara dati finali
    const cantiereData = {
      ...data,
      coordinate: coordinates,
      maps_link: mapsLink || generateGoogleMapsLink(coordinates.lat, coordinates.lng),
      foto_urls: fotoUrls,
    };

    // Callback
    onSubmit(cantiereData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {initialData ? 'Modifica Cantiere' : 'Nuovo Cantiere'}
      </h2>

      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
        {/* Sezione 1: Coordinate da Link Maps */}
        {!initialData && !initialCoordinates && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3">
              1. Inserisci Link Google/Apple Maps
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://maps.google.com/?q=46.0569,13.2348"
                {...register('maps_link_input')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleParseMapsLink}
                disabled={isParsingLink}
                className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
              >
                {isParsingLink ? 'Caricamento...' : 'Carica'}
              </button>
            </div>
            {parsedAddress && (
              <p className="mt-2 text-sm text-green-700">✅ Posizione: {parsedAddress}</p>
            )}
          </div>
        )}

        {/* Mostra coordinate se presenti */}
        {coordinates && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              📍 Coordinate: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
            </p>
          </div>
        )}

        {/* Sezione 2: Informazioni Base */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 text-lg">Informazioni Cantiere</h3>

          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Cantiere <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('nome', { required: 'Nome obbligatorio' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Es: Cantiere Residenziale Via Roma"
            />
            {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
          </div>

          {/* Indirizzo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Indirizzo</label>
            <input
              type="text"
              {...register('indirizzo')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Via Roma 123, Udine"
            />
          </div>

          {/* Cliente e Tipologia - riga */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <input
                type="text"
                {...register('cliente')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Costruzioni Rossi SRL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipologia</label>
              <select
                {...register('tipologia')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Residenziale">Residenziale</option>
                <option value="Industriale">Industriale</option>
                <option value="Stradale">Stradale</option>
                <option value="Altro">Altro</option>
              </select>
            </div>
          </div>

          {/* Orari e Difficoltà - riga */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Orari Cantiere</label>
              <input
                type="text"
                {...register('orari')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="7:00-18:00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Accesso camion
              </label>
              <select
                {...register('difficolta')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Facile">Facile</option>
                <option value="Medio">Medio</option>
                <option value="Difficile">Difficile</option>
              </select>
            </div>
          </div>

          {/* Note Operative */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note Operative</label>
            <textarea
              {...register('note_operative')}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Es: Citofono al civico 12, parcheggio pompa nel cortile a destra"
            />
          </div>
        </div>

        {/* Sezione 3: Date e Stato */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 text-lg">Pianificazione</h3>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Inizio</label>
              <input
                type="date"
                {...register('data_inizio')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Fine Prevista
              </label>
              <input
                type="date"
                {...register('data_fine_prevista')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stato</label>
              <select
                {...register('stato')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Attivo">Attivo</option>
                <option value="Sospeso">Sospeso</option>
                <option value="Completato">Completato</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sezione 4: Coordinatore */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 text-lg">Coordinatore Cantiere</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                {...register('coordinatore_nome')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Mario Rossi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
              <input
                type="tel"
                {...register('coordinatore_telefono')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="+39 333 1234567"
              />
            </div>
          </div>
        </div>

        {/* Sezione 5: Metri Cubi */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 text-lg">📊 Metri Cubi Calcestruzzo</h3>
          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-sm text-blue-800 font-medium">
              💡 Questi dati sono visibili a tutti gli utenti e autisti
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🎯 Metri Cubi da Fare Oggi
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                {...register('metri_cubi_oggi')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="es. 25.5"
              />
              <p className="text-xs text-gray-500 mt-1">Quantità programmata per oggi</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ✅ Metri Cubi Fatti in Precedenza
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                {...register('metri_cubi_precedenti')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="es. 120.0"
              />
              <p className="text-xs text-gray-500 mt-1">Totale consegnato fino a ieri</p>
            </div>
          </div>

          {/* Calcolo totale previsto */}
          {(watch('metri_cubi_oggi') > 0 || watch('metri_cubi_precedenti') > 0) && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-green-800">
                  📈 Totale Previsto Fine Giornata:
                </span>
                <span className="text-xl font-bold text-green-600">
                  {(parseFloat(watch('metri_cubi_oggi') || 0) + parseFloat(watch('metri_cubi_precedenti') || 0)).toFixed(1)} m³
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Sezione 6: Foto */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 text-lg">Foto Cantiere (max 5)</h3>

          <div>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg cursor-pointer transition"
            >
              📸 Scegli Foto/Video
            </label>
            <p className="text-sm text-gray-500 mt-2">
              Formati: JPG, PNG, MP4. Max 5MB per file.
            </p>
          </div>

          {/* Preview file selezionati */}
          {selectedFiles.length > 0 && (
            <div className="grid grid-cols-5 gap-3">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Progress upload */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>

        {/* Bottoni */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
          >
            {isLoading ? 'Salvataggio...' : initialData ? 'Aggiorna Cantiere' : 'Crea Cantiere'}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition"
            >
              Annulla
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
