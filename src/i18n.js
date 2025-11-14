// src/intl.js
import i18n from './i18n';

export const getLocale = () => i18n.language || 'en';

export const t = (key, values, options) => i18n.t(key, { ...values, ns: options?.ns });

export const formatNumber = (value, opts) =>
  new Intl.NumberFormat(getLocale(), opts).format(value);

export const formatCurrency = (amount, currency = 'INR') =>
  formatNumber(amount, { style: 'currency', currency });

export const formatDate = (date, opts = { year: 'numeric', month: 'short', day: 'numeric' }) => {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return new Intl.DateTimeFormat(getLocale(), opts).format(d);
};

export const formatRelativeTime = (value, unit) =>
  new Intl.RelativeTimeFormat(getLocale(), { numeric: 'auto' }).format(value, unit);

// React-friendly hook
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const useIntl = () => {
  useTranslation(); // subscribes to language changes
  const n = useCallback((v, o) => formatNumber(v, o), []);
  const c = useCallback((v, curr) => formatCurrency(v, curr), []);
  const d = useCallback((v, o) => formatDate(v, o), []);
  const rt = useCallback((val, unit) => formatRelativeTime(val, unit), []);
  const tr = useCallback((key, values, options) => t(key, values, options), []);
  return { locale: getLocale(), t: tr, formatNumber: n, formatCurrency: c, formatDate: d, formatRelativeTime: rt, changeLanguage: i18n.changeLanguage.bind(i18n) };
};
