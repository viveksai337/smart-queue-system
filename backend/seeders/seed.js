const { User, Branch } = require('../models');

const seedData = async () => {
    try {
        // Create admin user
        const adminExists = await User.findOne({ where: { email: 'admin@sqms.com' } });
        if (!adminExists) {
            await User.create({
                name: 'System Admin',
                phone: '+919999999999',
                email: 'admin@sqms.com',
                password_hash: 'admin123',
                role: 'admin',
            });
            console.log('✅ Admin user created (admin@sqms.com / admin123)');
        }

        // Create demo user
        const userExists = await User.findOne({ where: { email: 'user@sqms.com' } });
        if (!userExists) {
            await User.create({
                name: 'Demo User',
                phone: '+919888888888',
                email: 'user@sqms.com',
                password_hash: 'user123',
                role: 'user',
            });
            console.log('✅ Demo user created (user@sqms.com / user123)');
        }

        // Create sample branches - ALL HOSPITALS
        const branchCount = await Branch.count();
        if (branchCount === 0) {
            const hospitals = [

                // ===========================
                // 🏥 NIZAMABAD HOSPITALS
                // ===========================

                // --- Nizamabad Government ---
                { name: 'Government General Hospital Nizamabad', location: 'Khaleelwadi, Nizamabad, Telangana 503001', city: 'Nizamabad', type: 'hospital', category: 'government', total_counters: 10, active_counters: 7, avg_service_time: 15, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'District Hospital Nizamabad', location: 'Near Collector Office, Khaleelwadi, Nizamabad', city: 'Nizamabad', type: 'hospital', category: 'government', total_counters: 8, active_counters: 6, avg_service_time: 12, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Area Hospital Bodhan', location: 'Bodhan Town, Nizamabad District, Telangana', city: 'Nizamabad', type: 'hospital', category: 'government', total_counters: 5, active_counters: 4, avg_service_time: 10, opening_time: '09:00:00', closing_time: '17:00:00' },
                { name: 'CHC Balkonda', location: 'Balkonda, Nizamabad District', city: 'Nizamabad', type: 'hospital', category: 'government', total_counters: 3, active_counters: 2, avg_service_time: 10, opening_time: '09:00:00', closing_time: '17:00:00' },
                { name: 'CHC Dichpally', location: 'Dichpally, Nizamabad District', city: 'Nizamabad', type: 'hospital', category: 'government', total_counters: 3, active_counters: 2, avg_service_time: 10, opening_time: '09:00:00', closing_time: '17:00:00' },
                { name: 'CHC Morthad', location: 'Morthad, Nizamabad District', city: 'Nizamabad', type: 'hospital', category: 'government', total_counters: 3, active_counters: 2, avg_service_time: 10, opening_time: '09:00:00', closing_time: '17:00:00' },
                { name: 'CHC Navipet', location: 'Navipet, Nizamabad District', city: 'Nizamabad', type: 'hospital', category: 'government', total_counters: 3, active_counters: 2, avg_service_time: 10, opening_time: '09:00:00', closing_time: '17:00:00' },
                { name: 'CHC Varni', location: 'Varni, Nizamabad District', city: 'Nizamabad', type: 'hospital', category: 'government', total_counters: 3, active_counters: 2, avg_service_time: 10, opening_time: '09:00:00', closing_time: '17:00:00' },

                // --- Nizamabad Private ---
                { name: 'Medicover Hospitals Nizamabad', location: 'Saraswathi Nagar, Nizamabad, Telangana', city: 'Nizamabad', type: 'hospital', category: 'private', total_counters: 8, active_counters: 6, avg_service_time: 12, opening_time: '08:00:00', closing_time: '21:00:00' },
                { name: 'Sri Vishnu Super Speciality Hospital', location: 'Railway Station Road, Nizamabad, Telangana', city: 'Nizamabad', type: 'hospital', category: 'private', total_counters: 6, active_counters: 5, avg_service_time: 12, opening_time: '08:00:00', closing_time: '21:00:00' },
                { name: 'Pragathi Hospital Nizamabad', location: 'Hyderabad Road, Opp Kapila Hotel, Nizamabad 503003', city: 'Nizamabad', type: 'hospital', category: 'private', total_counters: 5, active_counters: 4, avg_service_time: 10, opening_time: '08:00:00', closing_time: '21:00:00' },
                { name: 'Bombay Nursing Home', location: 'Hyderabad Road, Yellammagutta Cross Road, Nizamabad 503003', city: 'Nizamabad', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'SVR Multispeciality Hospital', location: 'Hyderabad Road, Nizamabad', city: 'Nizamabad', type: 'hospital', category: 'private', total_counters: 5, active_counters: 4, avg_service_time: 10, opening_time: '08:00:00', closing_time: '21:00:00' },
                { name: 'Sai Neuro Super Speciality Hospital', location: 'Nizamabad Town, Telangana', city: 'Nizamabad', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 15, opening_time: '09:00:00', closing_time: '20:00:00' },
                { name: 'Niharika Hospital', location: 'Vinayak Nagar, Nizamabad', city: 'Nizamabad', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Dreamland Hope Superspeciality Hospital', location: 'Nizamabad RS Area, Telangana', city: 'Nizamabad', type: 'hospital', category: 'private', total_counters: 6, active_counters: 5, avg_service_time: 12, opening_time: '08:00:00', closing_time: '21:00:00' },
                { name: 'Kanteshwara Specialty Hospital', location: 'Kanteshwar Area, Nizamabad', city: 'Nizamabad', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Ramesh Multispeciality Hospital Nizamabad', location: 'Pragathi Nagar, Nizamabad', city: 'Nizamabad', type: 'hospital', category: 'private', total_counters: 5, active_counters: 4, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },

                // --- Nizamabad Specialty ---
                { name: 'Sri Ruma Eye Hospital', location: 'Nizamabad Town, Telangana', city: 'Nizamabad', type: 'hospital', category: 'specialty', total_counters: 3, active_counters: 2, avg_service_time: 15, opening_time: '09:00:00', closing_time: '18:00:00' },
                { name: "People's Dental Hospital", location: 'Nizamabad Town, Telangana', city: 'Nizamabad', type: 'hospital', category: 'specialty', total_counters: 2, active_counters: 2, avg_service_time: 20, opening_time: '09:00:00', closing_time: '18:00:00' },
                { name: 'SR Dental Hospital', location: 'Nizamabad Town, Telangana', city: 'Nizamabad', type: 'hospital', category: 'specialty', total_counters: 2, active_counters: 2, avg_service_time: 20, opening_time: '09:00:00', closing_time: '18:00:00' },
                { name: 'Neuroina Psychiatry Hospital', location: 'Nizamabad Town, Telangana', city: 'Nizamabad', type: 'hospital', category: 'specialty', total_counters: 2, active_counters: 2, avg_service_time: 25, opening_time: '09:00:00', closing_time: '18:00:00' },

                // ===========================
                // 🏥 HYDERABAD HOSPITALS
                // ===========================

                // --- Hyderabad Government ---
                { name: 'Osmania General Hospital', location: 'Afzal Gunj, Hyderabad, Telangana 500012', city: 'Hyderabad', type: 'hospital', category: 'government', total_counters: 20, active_counters: 15, avg_service_time: 15, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Gandhi Hospital', location: 'Bhoiguda Road, Musheerabad, Secunderabad, Telangana 500003', city: 'Hyderabad', type: 'hospital', category: 'government', total_counters: 18, active_counters: 14, avg_service_time: 15, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: "Nizam's Institute of Medical Sciences (NIMS)", location: 'Punjagutta, Hyderabad, Telangana 500082', city: 'Hyderabad', type: 'hospital', category: 'government', total_counters: 25, active_counters: 20, avg_service_time: 20, opening_time: '08:00:00', closing_time: '17:00:00' },
                { name: 'Niloufer Hospital (Women & Children)', location: 'Red Hills, Lakdikapul, Hyderabad, Telangana 500004', city: 'Hyderabad', type: 'hospital', category: 'government', total_counters: 12, active_counters: 10, avg_service_time: 15, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'MNJ Institute of Oncology & Regional Cancer Center', location: 'Red Hills, Lakdikapul, Hyderabad, Telangana 500004', city: 'Hyderabad', type: 'hospital', category: 'government', total_counters: 10, active_counters: 8, avg_service_time: 20, opening_time: '08:00:00', closing_time: '17:00:00' },
                { name: 'Government ENT Hospital', location: 'Bank Street, Koti, Hyderabad, Telangana', city: 'Hyderabad', type: 'hospital', category: 'government', total_counters: 6, active_counters: 5, avg_service_time: 12, opening_time: '09:00:00', closing_time: '17:00:00' },
                { name: 'Government TB & Chest Hospital', location: 'Erragadda, Hyderabad, Telangana', city: 'Hyderabad', type: 'hospital', category: 'government', total_counters: 6, active_counters: 4, avg_service_time: 15, opening_time: '09:00:00', closing_time: '17:00:00' },
                { name: 'Government Maternity Hospital Hyderabad', location: 'Sultan Bazar / Petlaburj, Hyderabad', city: 'Hyderabad', type: 'hospital', category: 'government', total_counters: 8, active_counters: 6, avg_service_time: 15, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Nizamia General Hospital (Unani)', location: 'Charminar Road, Hyderabad', city: 'Hyderabad', type: 'hospital', category: 'government', total_counters: 5, active_counters: 4, avg_service_time: 12, opening_time: '09:00:00', closing_time: '17:00:00' },
                { name: 'Golconda Government Hospital', location: 'Golconda Fort Road, Hyderabad', city: 'Hyderabad', type: 'hospital', category: 'government', total_counters: 5, active_counters: 4, avg_service_time: 12, opening_time: '09:00:00', closing_time: '17:00:00' },

                // --- Hyderabad Private ---
                { name: 'Apollo Hospitals Hyderabad', location: 'Jubilee Hills, Hyderabad, Telangana 500033', city: 'Hyderabad', type: 'hospital', category: 'private', total_counters: 20, active_counters: 16, avg_service_time: 15, opening_time: '07:00:00', closing_time: '22:00:00' },
                { name: 'Yashoda Hospitals', location: 'Raj Bhavan Road, Somajiguda, Hyderabad 500082', city: 'Hyderabad', type: 'hospital', category: 'private', total_counters: 15, active_counters: 12, avg_service_time: 12, opening_time: '07:00:00', closing_time: '22:00:00' },
                { name: 'CARE Hospitals', location: 'Road No.1, Banjara Hills, Hyderabad 500034', city: 'Hyderabad', type: 'hospital', category: 'private', total_counters: 12, active_counters: 10, avg_service_time: 12, opening_time: '08:00:00', closing_time: '21:00:00' },
                { name: 'AIG Hospitals', location: 'Mindspace Road, Gachibowli, Hyderabad 500032', city: 'Hyderabad', type: 'hospital', category: 'private', total_counters: 12, active_counters: 10, avg_service_time: 12, opening_time: '08:00:00', closing_time: '21:00:00' },
                { name: 'KIMS Hospitals', location: 'Minister Road, Secunderabad, Telangana', city: 'Hyderabad', type: 'hospital', category: 'private', total_counters: 12, active_counters: 10, avg_service_time: 12, opening_time: '08:00:00', closing_time: '21:00:00' },
                { name: 'Continental Hospitals', location: 'Nanakramguda, Gachibowli, Hyderabad', city: 'Hyderabad', type: 'hospital', category: 'private', total_counters: 10, active_counters: 8, avg_service_time: 12, opening_time: '08:00:00', closing_time: '21:00:00' },
                { name: 'Sunshine Hospitals Hyderabad', location: 'Paradise Circle, Secunderabad', city: 'Hyderabad', type: 'hospital', category: 'private', total_counters: 10, active_counters: 8, avg_service_time: 12, opening_time: '08:00:00', closing_time: '21:00:00' },
                { name: 'Medicover Hospitals Hyderabad', location: 'Hitech City, Hyderabad', city: 'Hyderabad', type: 'hospital', category: 'private', total_counters: 10, active_counters: 8, avg_service_time: 10, opening_time: '08:00:00', closing_time: '21:00:00' },
                { name: 'Pace Hospitals', location: 'Hitech City Road, Madhapur, Hyderabad', city: 'Hyderabad', type: 'hospital', category: 'private', total_counters: 8, active_counters: 6, avg_service_time: 10, opening_time: '08:00:00', closing_time: '21:00:00' },
                { name: 'Star Hospitals', location: 'Road No.10, Banjara Hills, Hyderabad', city: 'Hyderabad', type: 'hospital', category: 'private', total_counters: 10, active_counters: 8, avg_service_time: 12, opening_time: '08:00:00', closing_time: '21:00:00' },

                // ===========================
                // 🏥 WARANGAL HOSPITALS
                // ===========================

                // --- Warangal Government ---
                { name: 'MGM Hospital (Mahatma Gandhi Memorial)', location: 'Auto Nagar Road, Warangal, Telangana 506007', city: 'Warangal', type: 'hospital', category: 'government', total_counters: 15, active_counters: 12, avg_service_time: 15, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Government Maternity Hospital Warangal', location: 'Hanamkonda, Warangal, Telangana 506001', city: 'Warangal', type: 'hospital', category: 'government', total_counters: 6, active_counters: 5, avg_service_time: 15, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Government Chest Hospital Warangal', location: 'Rangashaipet, Warangal, Telangana', city: 'Warangal', type: 'hospital', category: 'government', total_counters: 4, active_counters: 3, avg_service_time: 12, opening_time: '09:00:00', closing_time: '17:00:00' },
                { name: 'Government Area Hospital Warangal', location: 'Jangaon Road, Warangal', city: 'Warangal', type: 'hospital', category: 'government', total_counters: 5, active_counters: 4, avg_service_time: 12, opening_time: '09:00:00', closing_time: '17:00:00' },
                { name: 'UPHC Hanamkonda', location: 'Hanamkonda, Warangal', city: 'Warangal', type: 'hospital', category: 'government', total_counters: 3, active_counters: 2, avg_service_time: 10, opening_time: '09:00:00', closing_time: '17:00:00' },
                { name: 'UPHC Kazipet', location: 'Kazipet, Warangal', city: 'Warangal', type: 'hospital', category: 'government', total_counters: 3, active_counters: 2, avg_service_time: 10, opening_time: '09:00:00', closing_time: '17:00:00' },

                // --- Warangal Private ---
                { name: 'Rohini Super Speciality Hospitals', location: 'Mulugu Road, Warangal, Telangana 506007', city: 'Warangal', type: 'hospital', category: 'private', total_counters: 8, active_counters: 6, avg_service_time: 12, opening_time: '08:00:00', closing_time: '21:00:00' },
                { name: 'Prashanthi Hospital', location: 'Hanamkonda, Warangal', city: 'Warangal', type: 'hospital', category: 'private', total_counters: 5, active_counters: 4, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'AJARA Hospitals', location: 'Naim Nagar, Hanamkonda, Telangana 506001', city: 'Warangal', type: 'hospital', category: 'private', total_counters: 6, active_counters: 5, avg_service_time: 10, opening_time: '08:00:00', closing_time: '21:00:00' },
                { name: 'Amrutha Children Hospital', location: 'Hanamkonda, Warangal', city: 'Warangal', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'LifeLine Hospitals Warangal', location: 'Hanamkonda, Warangal', city: 'Warangal', type: 'hospital', category: 'private', total_counters: 5, active_counters: 4, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Maxcare Hospital', location: 'Nakkalagutta, Hanamkonda, Warangal', city: 'Warangal', type: 'hospital', category: 'private', total_counters: 6, active_counters: 5, avg_service_time: 10, opening_time: '08:00:00', closing_time: '21:00:00' },
                { name: 'Adithya Hospital Warangal', location: 'Hanamkonda, Warangal', city: 'Warangal', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Shanti Hospital Warangal', location: 'Kazipet Road, Warangal', city: 'Warangal', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Sri Harsha Hospital', location: 'Hanamkonda, Warangal', city: 'Warangal', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Oasis Fertility Hospital Warangal', location: 'Hanamkonda, Warangal', city: 'Warangal', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 15, opening_time: '09:00:00', closing_time: '18:00:00' },

                // --- Warangal Specialty ---
                { name: 'Aravind Eye Hospital Warangal', location: 'Warangal Town, Telangana', city: 'Warangal', type: 'hospital', category: 'specialty', total_counters: 4, active_counters: 3, avg_service_time: 15, opening_time: '09:00:00', closing_time: '18:00:00' },
                { name: 'Surya Dental Hospital Warangal', location: 'Warangal Town, Telangana', city: 'Warangal', type: 'hospital', category: 'specialty', total_counters: 2, active_counters: 2, avg_service_time: 20, opening_time: '09:00:00', closing_time: '18:00:00' },
                { name: "Hope Children's Hospital", location: 'Warangal Town, Telangana', city: 'Warangal', type: 'hospital', category: 'specialty', total_counters: 3, active_counters: 2, avg_service_time: 12, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Sai Orthopedic Hospital Warangal', location: 'Warangal Town, Telangana', city: 'Warangal', type: 'hospital', category: 'specialty', total_counters: 3, active_counters: 2, avg_service_time: 15, opening_time: '09:00:00', closing_time: '18:00:00' },

                // ===========================
                // 🏥 KARIMNAGAR HOSPITALS
                // ===========================

                // --- Karimnagar Government ---
                { name: 'District HQ Hospital Karimnagar', location: 'Civil Hospital Road, Karimnagar, Telangana 505001', city: 'Karimnagar', type: 'hospital', category: 'government', total_counters: 10, active_counters: 8, avg_service_time: 15, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Government Maternity Hospital Karimnagar', location: 'Civil Hospital Road, Karimnagar, Telangana', city: 'Karimnagar', type: 'hospital', category: 'government', total_counters: 5, active_counters: 4, avg_service_time: 15, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Government Chest Hospital Karimnagar', location: 'Rekurthi, Karimnagar, Telangana', city: 'Karimnagar', type: 'hospital', category: 'government', total_counters: 4, active_counters: 3, avg_service_time: 12, opening_time: '09:00:00', closing_time: '17:00:00' },
                { name: 'Area Hospital Huzurabad', location: 'Huzurabad, Karimnagar District, Telangana', city: 'Karimnagar', type: 'hospital', category: 'government', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '09:00:00', closing_time: '17:00:00' },
                { name: 'Area Hospital Jammikunta', location: 'Jammikunta, Karimnagar District', city: 'Karimnagar', type: 'hospital', category: 'government', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '09:00:00', closing_time: '17:00:00' },
                { name: 'CHC Choppadandi', location: 'Choppadandi, Karimnagar District', city: 'Karimnagar', type: 'hospital', category: 'government', total_counters: 3, active_counters: 2, avg_service_time: 10, opening_time: '09:00:00', closing_time: '17:00:00' },

                // --- Karimnagar Private ---
                { name: 'Apollo Reach Hospitals Karimnagar', location: 'Kaman Road, Karimnagar, Telangana 505001', city: 'Karimnagar', type: 'hospital', category: 'private', total_counters: 10, active_counters: 8, avg_service_time: 12, opening_time: '08:00:00', closing_time: '21:00:00' },
                { name: 'Prathima Institute of Medical Sciences', location: 'Nagunur, Karimnagar, Telangana', city: 'Karimnagar', type: 'hospital', category: 'private', total_counters: 8, active_counters: 6, avg_service_time: 15, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Sai Krishna Multispeciality Hospital Karimnagar', location: 'Mukarampura, Karimnagar', city: 'Karimnagar', type: 'hospital', category: 'private', total_counters: 5, active_counters: 4, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Sunshine Hospital Karimnagar', location: 'Karimnagar Town, Telangana', city: 'Karimnagar', type: 'hospital', category: 'private', total_counters: 5, active_counters: 4, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Surya Hospital Karimnagar', location: 'Court Road, Karimnagar', city: 'Karimnagar', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Sri Sai Ram Hospital Karimnagar', location: 'Karimnagar Town', city: 'Karimnagar', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Apex Hospital Karimnagar', location: 'Karimnagar Main Road', city: 'Karimnagar', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Aditya Hospital Karimnagar', location: 'Karimnagar Town', city: 'Karimnagar', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Amrutha Hospital Karimnagar', location: 'Karimnagar Town', city: 'Karimnagar', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Venkateshwara Hospital Karimnagar', location: 'Karimnagar Town', city: 'Karimnagar', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },

                // --- Karimnagar Specialty ---
                { name: 'Vasan Eye Care Hospital Karimnagar', location: 'Karimnagar Town', city: 'Karimnagar', type: 'hospital', category: 'specialty', total_counters: 3, active_counters: 2, avg_service_time: 15, opening_time: '09:00:00', closing_time: '18:00:00' },
                { name: 'Ramesh Dental Hospital Karimnagar', location: 'Karimnagar Town', city: 'Karimnagar', type: 'hospital', category: 'specialty', total_counters: 2, active_counters: 2, avg_service_time: 20, opening_time: '09:00:00', closing_time: '18:00:00' },

                // ===========================
                // 🏥 KHAMMAM HOSPITALS
                // ===========================

                // --- Khammam Government ---
                { name: 'District HQ Hospital Khammam', location: 'Wyra Road, Khammam, Telangana 507001', city: 'Khammam', type: 'hospital', category: 'government', total_counters: 10, active_counters: 7, avg_service_time: 15, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Government Maternity Hospital Khammam', location: 'Near District Hospital, Wyra Road, Khammam', city: 'Khammam', type: 'hospital', category: 'government', total_counters: 5, active_counters: 4, avg_service_time: 15, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Government Chest Hospital Khammam', location: 'Khammam Town, Telangana', city: 'Khammam', type: 'hospital', category: 'government', total_counters: 4, active_counters: 3, avg_service_time: 12, opening_time: '09:00:00', closing_time: '17:00:00' },
                { name: 'Area Hospital Sathupalli', location: 'Sathupalli, Khammam District, Telangana', city: 'Khammam', type: 'hospital', category: 'government', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '09:00:00', closing_time: '17:00:00' },
                { name: 'Area Hospital Madhira', location: 'Madhira, Khammam District', city: 'Khammam', type: 'hospital', category: 'government', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '09:00:00', closing_time: '17:00:00' },
                { name: 'CHC Wyra', location: 'Wyra, Khammam District', city: 'Khammam', type: 'hospital', category: 'government', total_counters: 3, active_counters: 2, avg_service_time: 10, opening_time: '09:00:00', closing_time: '17:00:00' },
                { name: 'CHC Kallur', location: 'Kallur, Khammam District', city: 'Khammam', type: 'hospital', category: 'government', total_counters: 3, active_counters: 2, avg_service_time: 10, opening_time: '09:00:00', closing_time: '17:00:00' },

                // --- Khammam Private ---
                { name: 'Mamatha General Hospital', location: 'Rotary Nagar, Khammam, Telangana 507002', city: 'Khammam', type: 'hospital', category: 'private', total_counters: 8, active_counters: 6, avg_service_time: 12, opening_time: '08:00:00', closing_time: '21:00:00' },
                { name: 'Radhika Multi Speciality Hospital', location: 'Wyra Road, Khammam', city: 'Khammam', type: 'hospital', category: 'private', total_counters: 5, active_counters: 4, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Sri Sai Krishna Hospital Khammam', location: 'Khammam Town', city: 'Khammam', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Aditya Hospital Khammam', location: 'Nizampet Road, Khammam', city: 'Khammam', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Sree Ram Hospitals', location: 'Wyra Road, Khammam', city: 'Khammam', type: 'hospital', category: 'private', total_counters: 5, active_counters: 4, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Cure Hospitals Khammam', location: 'Khammam Main Road', city: 'Khammam', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Sri Venkateswara Hospital Khammam', location: 'Khammam Town', city: 'Khammam', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Life Line Hospital Khammam', location: 'Khammam Town', city: 'Khammam', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Haritha Hospitals', location: 'Khammam Town', city: 'Khammam', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Sri Sai Multispeciality Hospital Khammam', location: 'Khammam Town', city: 'Khammam', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },

                // ===========================
                // 🏥 MAHABUBNAGAR HOSPITALS
                // ===========================

                // --- Mahabubnagar Government ---
                { name: 'District Government Hospital Mahabubnagar', location: 'General Hospital Road, Mahabubnagar, Telangana 509001', city: 'Mahabubnagar', type: 'hospital', category: 'government', total_counters: 10, active_counters: 7, avg_service_time: 15, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Government Maternity Hospital Mahabubnagar', location: 'Mahabubnagar Town, Telangana', city: 'Mahabubnagar', type: 'hospital', category: 'government', total_counters: 5, active_counters: 4, avg_service_time: 15, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Area Hospital Jadcherla', location: 'Jadcherla, Mahabubnagar District, Telangana', city: 'Mahabubnagar', type: 'hospital', category: 'government', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '09:00:00', closing_time: '17:00:00' },
                { name: 'Area Hospital Narayanpet', location: 'Narayanpet, Mahabubnagar District', city: 'Mahabubnagar', type: 'hospital', category: 'government', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '09:00:00', closing_time: '17:00:00' },
                { name: 'CHC Devarakadra', location: 'Devarakadra, Mahabubnagar District', city: 'Mahabubnagar', type: 'hospital', category: 'government', total_counters: 3, active_counters: 2, avg_service_time: 10, opening_time: '09:00:00', closing_time: '17:00:00' },
                { name: 'CHC Bhoothpur', location: 'Bhoothpur, Mahabubnagar District', city: 'Mahabubnagar', type: 'hospital', category: 'government', total_counters: 3, active_counters: 2, avg_service_time: 10, opening_time: '09:00:00', closing_time: '17:00:00' },

                // --- Mahabubnagar Private ---
                { name: 'SVS Medical College & Hospital', location: 'Yenugonda, Mahabubnagar, Telangana 509001', city: 'Mahabubnagar', type: 'hospital', category: 'private', total_counters: 10, active_counters: 8, avg_service_time: 15, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Sri Sai Ram Hospital Mahabubnagar', location: 'Mahabubnagar Town', city: 'Mahabubnagar', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Venkateshwara Hospital Mahabubnagar', location: 'Mahabubnagar Town', city: 'Mahabubnagar', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Surya Hospital Mahabubnagar', location: 'Mahabubnagar Town', city: 'Mahabubnagar', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Life Care Hospital Mahabubnagar', location: 'Mahabubnagar Town', city: 'Mahabubnagar', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Aditya Hospital Mahabubnagar', location: 'Mahabubnagar Town', city: 'Mahabubnagar', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Sri Balaji Hospital Mahabubnagar', location: 'Mahabubnagar Town', city: 'Mahabubnagar', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Sai Krishna Multispeciality Hospital Mahabubnagar', location: 'Mahabubnagar Town', city: 'Mahabubnagar', type: 'hospital', category: 'private', total_counters: 5, active_counters: 4, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Mother & Child Hospital Mahabubnagar', location: 'Mahabubnagar Town', city: 'Mahabubnagar', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 12, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Sai Orthopedic Hospital Mahabubnagar', location: 'Mahabubnagar Town', city: 'Mahabubnagar', type: 'hospital', category: 'private', total_counters: 3, active_counters: 2, avg_service_time: 15, opening_time: '09:00:00', closing_time: '18:00:00' },

                // ===========================
                // 🏥 NALGONDA HOSPITALS
                // ===========================

                // --- Nalgonda Government ---
                { name: 'District Government General Hospital Nalgonda', location: 'Miryalaguda Road, Nalgonda, Telangana 508001', city: 'Nalgonda', type: 'hospital', category: 'government', total_counters: 10, active_counters: 7, avg_service_time: 15, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Government Maternity Hospital Nalgonda', location: 'Near District Hospital, Nalgonda, Telangana', city: 'Nalgonda', type: 'hospital', category: 'government', total_counters: 5, active_counters: 4, avg_service_time: 15, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Area Hospital Miryalaguda', location: 'Miryalaguda, Nalgonda District, Telangana', city: 'Nalgonda', type: 'hospital', category: 'government', total_counters: 5, active_counters: 4, avg_service_time: 10, opening_time: '09:00:00', closing_time: '17:00:00' },
                { name: 'Area Hospital Devarakonda', location: 'Devarakonda, Nalgonda District', city: 'Nalgonda', type: 'hospital', category: 'government', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '09:00:00', closing_time: '17:00:00' },
                { name: 'Area Hospital Nakrekal', location: 'Nakrekal, Nalgonda District', city: 'Nalgonda', type: 'hospital', category: 'government', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '09:00:00', closing_time: '17:00:00' },
                { name: 'CHC Chandur', location: 'Chandur, Nalgonda District', city: 'Nalgonda', type: 'hospital', category: 'government', total_counters: 3, active_counters: 2, avg_service_time: 10, opening_time: '09:00:00', closing_time: '17:00:00' },
                { name: 'CHC Chityal', location: 'Chityal, Nalgonda District', city: 'Nalgonda', type: 'hospital', category: 'government', total_counters: 3, active_counters: 2, avg_service_time: 10, opening_time: '09:00:00', closing_time: '17:00:00' },

                // --- Nalgonda Private ---
                { name: 'Kamineni Institute of Medical Sciences', location: 'Sreepuram, Narketpally, Nalgonda District, Telangana', city: 'Nalgonda', type: 'hospital', category: 'private', total_counters: 10, active_counters: 8, avg_service_time: 15, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Sri Sai Hospital Nalgonda', location: 'Nalgonda Town', city: 'Nalgonda', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Surya Hospital Nalgonda', location: 'Miryalaguda Road, Nalgonda', city: 'Nalgonda', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Life Care Hospital Nalgonda', location: 'Nalgonda Town', city: 'Nalgonda', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Aditya Hospital Nalgonda', location: 'Nalgonda Town', city: 'Nalgonda', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Venkateshwara Hospital Nalgonda', location: 'Nalgonda Town', city: 'Nalgonda', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Sri Balaji Hospital Nalgonda', location: 'Nalgonda Town', city: 'Nalgonda', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Sai Krishna Multispeciality Hospital Nalgonda', location: 'Nalgonda Town', city: 'Nalgonda', type: 'hospital', category: 'private', total_counters: 5, active_counters: 4, avg_service_time: 10, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Mother & Child Hospital Nalgonda', location: 'Nalgonda Town', city: 'Nalgonda', type: 'hospital', category: 'private', total_counters: 4, active_counters: 3, avg_service_time: 12, opening_time: '08:00:00', closing_time: '20:00:00' },
                { name: 'Sai Orthopedic Hospital Nalgonda', location: 'Nalgonda Town', city: 'Nalgonda', type: 'hospital', category: 'private', total_counters: 3, active_counters: 2, avg_service_time: 15, opening_time: '09:00:00', closing_time: '18:00:00' },
            ];

            await Branch.bulkCreate(hospitals);
            console.log(`✅ ${hospitals.length} hospitals seeded across 7 cities in Telangana`);
        }

        console.log('✅ Database seeding complete!');
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
    }
};

module.exports = seedData;
