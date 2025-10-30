export default {
  labels: {
    status: {
      Pending: 'Pending',
      Approved: 'Approved',
      Rejected: 'Rejected',
    },
  },
  errors: {
    authMissing: 'Missing X-User-Id',
    authInvalid: 'Invalid user',
    forbidden: 'Forbidden',
    notFound: 'Not found',
    overlapCreate: 'Dates overlap an existing request.',
    overlapApprove: 'Approval would overlap another approved request.',
    dateOrder: 'start_date must be <= end_date',
    notDeletableRequester: 'Only pending requests can be deleted by the requester.',
    notDeletableValidator: 'Approved requests cannot be deleted.',
    badParams: 'Invalid request parameters.',
  },
  success: {
    approved: 'Request approved.',
    rejected: 'Request rejected.',
    deleted: 'Request deleted.',
  },
}
