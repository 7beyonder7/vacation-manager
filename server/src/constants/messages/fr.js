export default {
  labels: {
    status: {
      Pending: 'En attente',
      Approved: 'Approuvée',
      Rejected: 'Rejetée',
    },
  },
  errors: {
    authMissing: 'En-tête X-User-Id manquant',
    authInvalid: 'Utilisateur invalide',
    forbidden: 'Interdit',
    notFound: 'Introuvable',
    overlapCreate: 'Les dates se chevauchent avec une demande existante.',
    overlapApprove: 'La validation chevaucherait une demande déjà approuvée.',
    dateOrder: 'start_date doit être ≤ end_date',
    notDeletableRequester: 'Seules les demandes en attente peuvent être supprimées par le demandeur.',
    notDeletableValidator: 'Les demandes approuvées ne peuvent pas être supprimées.',
    badParams: 'Paramètres de requête invalides.',
  },
  success: {
    approved: 'Demande approuvée.',
    rejected: 'Demande rejetée.',
    deleted: 'Demande supprimée.',
  },
}
