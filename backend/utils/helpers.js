const crypto = require('crypto');

// Category prefixes mapping
const CATEGORY_PREFIXES = {
    hospital: 'HOS',
    bank: 'BNK',
    government: 'GOV',
    rto: 'RTO',
    passport: 'PSP',
    hotel: 'HTL',
};

// Purpose options per category
const PURPOSE_OPTIONS = {
    hospital: ['General Checkup', 'OPD Consultation', 'Emergency', 'Lab Test', 'X-Ray / Scan', 'Vaccination', 'Blood Test', 'Pharmacy Collection', 'Admission', 'Discharge', 'Follow-up Visit', 'Specialist Consultation'],
    bank: ['Account Opening', 'Cash Deposit', 'Cash Withdrawal', 'Aadhar Update', 'PAN Link', 'Loan Enquiry', 'Fixed Deposit', 'Passbook Update', 'Cheque Deposit', 'ATM Card Issue', 'Net Banking', 'NEFT/RTGS Transfer', 'Locker Service'],
    government: ['Aadhar Update', 'Birth Certificate', 'Death Certificate', 'Income Certificate', 'Caste Certificate', 'Property Registration', 'Land Records', 'Pension', 'Ration Card', 'Election ID', 'Domicile Certificate'],
    rto: ['Driving License - New', 'Driving License - Renewal', 'Learning License', 'Vehicle Registration', 'RC Transfer', 'Address Change', 'Duplicate License', 'International License', 'Fitness Certificate', 'NOC'],
    passport: ['Fresh Passport', 'Passport Renewal', 'Tatkal Passport', 'Police Clearance', 'Address Change', 'Name Change', 'Lost Passport', 'Damaged Passport'],
    hotel: ['Table Booking', 'Room Check-in', 'Room Check-out', 'Food Order', 'Room Service', 'Buffet Entry', 'Event Booking', 'Takeaway Order'],
};

const getCategoryPrefix = (branchType) => {
    return CATEGORY_PREFIXES[branchType] || 'GEN';
};

const getPurposeOptions = (branchType) => {
    return PURPOSE_OPTIONS[branchType] || ['General Service'];
};

const generateTokenNumber = (branchId, branchType) => {
    const prefix = getCategoryPrefix(branchType);
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${branchId}-${dateStr}-${random}`;
};

const generateQRCode = () => {
    return crypto.randomUUID();
};

const calculateEstimatedTime = (queueLength, avgServiceTime, activeCounters) => {
    if (activeCounters === 0) return 999;
    return Math.ceil((queueLength * avgServiceTime) / activeCounters);
};

const isPeakHour = () => {
    const hour = new Date().getHours();
    return (hour >= 10 && hour <= 13) || (hour >= 14 && hour <= 16);
};

const getPeakHourFactor = () => {
    return isPeakHour() ? 1.3 : 1.0;
};

const formatDuration = (minutes) => {
    if (minutes < 1) return 'Less than a minute';
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
};

module.exports = {
    generateTokenNumber,
    generateQRCode,
    calculateEstimatedTime,
    isPeakHour,
    getPeakHourFactor,
    formatDuration,
    getCategoryPrefix,
    getPurposeOptions,
    CATEGORY_PREFIXES,
    PURPOSE_OPTIONS,
};
