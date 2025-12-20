import { useState, useEffect } from 'react';
import { subscribeToNoteAutisti, createNotaAutista, deleteNotaAutista } from '../firebase/firestore';
import { uploadMedia, validateMediaFile } from '../firebase/storage';

/**
 * Componente per visualizzare e aggiungere note autisti
 * @param {Object} props
 * @param {string} props.cantiereId - ID del cantiere
 * @param {Object} props.currentUser - Utente corrente (opzionale)
 */
export default function NoteAutisti({ cantiereId, currentUser }) {
  const [note, setNote] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form nuova nota
  const [testoNota, setTestoNota] = useState('');
  const [autistaNome, setAutistaNome] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Subscribe alle note in real-time
  useEffect(() => {
    if (!cantiereId) return;

    const unsubscribe = subscribeToNoteAutisti(cantiereId, (result) => {
      if (result.success) {
        setNote(result.data);
      }
      setIsLoading(false);
    });

    return () => unsubscribe && unsubscribe();
  }, [cantiereId]);

  // Gestione selezione file
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateMediaFile(file, 10); // Max 10MB per note autisti
    if (!validation.valid) {
      alert(`Errore: ${validation.error}`);
      return;
    }

    setSelectedFile(file);

    // Preview
    if (file.type.startsWith('image/')) {
      setFilePreview(URL.createObjectURL(file));
    } else {
      setFilePreview(null);
    }
  };

  // Submit nuova nota
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!testoNota.trim() && !selectedFile) {
      alert('Inserisci almeno un testo o una foto/video');
      return;
    }

    if (!autistaNome.trim()) {
      alert('Inserisci il tuo nome');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload media se presente
      let mediaUrl = null;
      let mediaType = null;

      if (selectedFile) {
        const uploadResult = await uploadMedia(selectedFile, cantiereId, 'note-autisti');
        if (uploadResult.success) {
          mediaUrl = uploadResult.url;
          mediaType = selectedFile.type.startsWith('image/') ? 'image' : 'video';
        } else {
          alert(`Errore upload: ${uploadResult.error}`);
          setIsSubmitting(false);
          return;
        }
      }

      // Crea nota
      const notaData = {
        cantiere_id: cantiereId,
        autista_nome: autistaNome.trim(),
        testo: testoNota.trim(),
        media_urls: mediaUrl ? [mediaUrl] : [],
        media_types: mediaType ? [mediaType] : [],
      };

      const result = await createNotaAutista(notaData);

      if (result.success) {
        // Reset form
        setTestoNota('');
        setAutistaNome('');
        setSelectedFile(null);
        setFilePreview(null);
        setShowAddForm(false);
        alert('✅ Nota aggiunta con successo!');
      } else {
        alert(`Errore: ${result.error}`);
      }
    } catch (error) {
      console.error('Errore aggiunta nota:', error);
      alert('Errore durante aggiunta nota');
    }

    setIsSubmitting(false);
  };

  // Elimina nota (solo se utente corrente è autore)
  const handleDelete = async (nota) => {
    if (!window.confirm('Eliminare questa nota?')) return;

    const result = await deleteNotaAutista(nota.id);
    if (result.success) {
      alert('✅ Nota eliminata');
    } else {
      alert(`Errore: ${result.error}`);
    }
  };

  // Formatta timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
    return date.toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-500 text-center">Caricamento note...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          Note Autisti {note.length > 0 && `(${note.length})`}
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition"
        >
          {showAddForm ? '❌ Chiudi' : '➕ Aggiungi Nota'}
        </button>
      </div>

      {/* Form aggiungi nota */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Il tuo nome <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={autistaNome}
                onChange={(e) => setAutistaNome(e.target.value)}
                placeholder="Es: Giovanni"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nota</label>
              <textarea
                value={testoNota}
                onChange={(e) => setTestoNota(e.target.value)}
                placeholder="Es: Oggi parcheggio pieno, usare via laterale..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Foto/Video (opzionale)</label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="w-full text-sm"
              />
              {filePreview && (
                <img src={filePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              {isSubmitting ? 'Invio...' : '✅ Aggiungi Nota'}
            </button>
          </div>
        </form>
      )}

      {/* Lista note */}
      <div className="space-y-4">
        {note.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-lg">Nessuna nota ancora</p>
            <p className="text-sm">Sii il primo ad aggiungere una nota utile per i colleghi!</p>
          </div>
        ) : (
          note.map((nota) => (
            <div key={nota.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              {/* Header nota */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-gray-900">{nota.autista_nome}</p>
                  <p className="text-xs text-gray-500">{formatTimestamp(nota.timestamp)}</p>
                </div>

                {/* Bottone elimina (opzionale - solo per autore o admin) */}
                {currentUser && currentUser.displayName === nota.autista_nome && (
                  <button
                    onClick={() => handleDelete(nota)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    🗑️
                  </button>
                )}
              </div>

              {/* Testo nota */}
              {nota.testo && <p className="text-gray-800 mb-2">{nota.testo}</p>}

              {/* Media (foto/video) */}
              {nota.media_urls && nota.media_urls.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {nota.media_urls.map((url, index) => {
                    const type = nota.media_types ? nota.media_types[index] : 'image';
                    return type === 'image' ? (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img
                          src={url}
                          alt="Foto nota"
                          className="w-full h-32 object-cover rounded-lg hover:opacity-90 transition"
                        />
                      </a>
                    ) : (
                      <video
                        key={index}
                        src={url}
                        controls
                        className="w-full h-32 rounded-lg"
                      />
                    );
                  })}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
