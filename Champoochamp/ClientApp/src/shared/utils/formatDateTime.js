import moment from 'moment';

export const formatDate = date => moment(date).format('DD/MM/YYYY');

export const formatDateTime = dateTime =>
  moment(dateTime).format('HH:mm:ss DD/MM/YYYY');
