import { db } from './database';

// Seed data matching the SQL file
export async function seedDatabase(): Promise<void> {
    // Clear existing data
    await db.transaction('rw', [
        db.users,
        db.candidates,
        db.candidatePersonal,
        db.candidateQualifications,
        db.candidateExperiences,
        db.candidateCertifications,
        db.meetingState,
        db.votes
    ], async () => {
        await db.users.clear();
        await db.candidates.clear();
        await db.candidatePersonal.clear();
        await db.candidateQualifications.clear();
        await db.candidateExperiences.clear();
        await db.candidateCertifications.clear();
        await db.meetingState.clear();
        await db.votes.clear();

        // Users (passwords: admin123, member123)
        // Note: In production, use proper bcrypt. For demo, using plain text comparison
        await db.users.bulkAdd([
            { id: 1, fullName: 'Ranjit Singh (HR Manager)', username: 'admin', passwordHash: 'admin123', role: 'admin', createdAt: new Date().toISOString() },
            { id: 2, fullName: 'Board Member 1', username: 'member1', passwordHash: 'member123', role: 'member', createdAt: new Date().toISOString() },
            { id: 3, fullName: 'Board Member 2', username: 'member2', passwordHash: 'member123', role: 'member', createdAt: new Date().toISOString() }
        ]);

        // Candidates
        await db.candidates.bulkAdd([
            { id: 1, fullName: 'Amit Kumar', latestQualification: 'M.Tech (Computer Science)', lastCompany: 'TechNova Pvt Ltd', totalExperienceYears: 7, expertise: 'coding', photoPath: 'assets/img/placeholder.jpg', createdAt: new Date().toISOString() },
            { id: 2, fullName: 'Neha Sharma', latestQualification: 'MBA (HR)', lastCompany: 'PeopleFirst Ltd', totalExperienceYears: 6, expertise: 'HR', photoPath: 'assets/img/placeholder.jpg', createdAt: new Date().toISOString() },
            { id: 3, fullName: 'Rahul Verma', latestQualification: 'B.Tech (Mechanical)', lastCompany: 'MegaWorks Industries', totalExperienceYears: 8, expertise: 'production engineer', photoPath: 'assets/img/placeholder.jpg', createdAt: new Date().toISOString() }
        ]);

        // Candidate Personal
        await db.candidatePersonal.bulkAdd([
            { candidateId: 1, address: 'Bengaluru, Karnataka', nationality: 'Indian', phone: '+91-90000-00001', father: 'Suresh Kumar', mother: 'Anita Kumar', spouse: 'Priya', children: '1' },
            { candidateId: 2, address: 'Pune, Maharashtra', nationality: 'Indian', phone: '+91-90000-00002', father: 'Mahesh Sharma', mother: 'Sunita Sharma', spouse: '', children: '' },
            { candidateId: 3, address: 'Chandigarh', nationality: 'Indian', phone: '+91-90000-00003', father: 'Rakesh Verma', mother: 'Meena Verma', spouse: 'Sonal', children: '2' }
        ]);

        // Qualifications for Amit (id: 1)
        await db.candidateQualifications.bulkAdd([
            { candidateId: 1, level: '10th', subject: 'Science/Math', institution: 'CBSE', year: 2009, marks: '89%', grade: 'A1', sortOrder: 1 },
            { candidateId: 1, level: '12th', subject: 'PCM', institution: 'CBSE', year: 2011, marks: '86%', grade: 'A', sortOrder: 2 },
            { candidateId: 1, level: 'Graduation', subject: 'Computer Science', institution: 'VTU', year: 2015, marks: '8.1 CGPA', grade: 'A', sortOrder: 3 },
            { candidateId: 1, level: 'Masters', subject: 'Computer Science', institution: 'IIT', year: 2017, marks: '8.6 CGPA', grade: 'A+', sortOrder: 4 }
        ]);

        // Qualifications for Neha (id: 2)
        await db.candidateQualifications.bulkAdd([
            { candidateId: 2, level: '10th', subject: 'All', institution: 'State Board', year: 2010, marks: '90%', grade: 'A1', sortOrder: 1 },
            { candidateId: 2, level: '12th', subject: 'Commerce', institution: 'State Board', year: 2012, marks: '88%', grade: 'A', sortOrder: 2 },
            { candidateId: 2, level: 'Graduation', subject: 'BBA', institution: 'Uni Pune', year: 2015, marks: '78%', grade: 'B+', sortOrder: 3 },
            { candidateId: 2, level: 'Masters', subject: 'MBA (HR)', institution: 'SIMS', year: 2017, marks: '7.9 CGPA', grade: 'A', sortOrder: 4 }
        ]);

        // Qualifications for Rahul (id: 3)
        await db.candidateQualifications.bulkAdd([
            { candidateId: 3, level: '10th', subject: 'All', institution: 'CBSE', year: 2008, marks: '85%', grade: 'A', sortOrder: 1 },
            { candidateId: 3, level: '12th', subject: 'PCM', institution: 'CBSE', year: 2010, marks: '82%', grade: 'B+', sortOrder: 2 },
            { candidateId: 3, level: 'Graduation', subject: 'Mechanical', institution: 'NIT', year: 2014, marks: '7.6 CGPA', grade: 'A', sortOrder: 3 }
        ]);

        // Experiences
        await db.candidateExperiences.bulkAdd([
            { candidateId: 1, fromYear: 2017, toYear: 2020, company: 'TechNova Pvt Ltd', address: 'Bengaluru', roleTitle: 'Software Engineer' },
            { candidateId: 1, fromYear: 2020, toYear: 2024, company: 'TechNova Pvt Ltd', address: 'Bengaluru', roleTitle: 'Senior Software Engineer' },
            { candidateId: 2, fromYear: 2017, toYear: 2020, company: 'PeopleFirst Ltd', address: 'Pune', roleTitle: 'HR Executive' },
            { candidateId: 2, fromYear: 2020, toYear: 2024, company: 'PeopleFirst Ltd', address: 'Pune', roleTitle: 'HR Manager' },
            { candidateId: 3, fromYear: 2014, toYear: 2019, company: 'MegaWorks Industries', address: 'Chandigarh', roleTitle: 'Maintenance Engineer' },
            { candidateId: 3, fromYear: 2019, toYear: 2024, company: 'MegaWorks Industries', address: 'Chandigarh', roleTitle: 'Production Engineer' }
        ]);

        // Certifications
        await db.candidateCertifications.bulkAdd([
            { candidateId: 1, title: 'AWS Certified Developer', authority: 'Amazon', year: 2021, notes: 'Associate' },
            { candidateId: 1, title: 'Oracle SQL', authority: 'Oracle', year: 2019, notes: '' },
            { candidateId: 2, title: 'SHRM-CP', authority: 'SHRM', year: 2022, notes: 'Human resources certification' },
            { candidateId: 3, title: 'Six Sigma Green Belt', authority: 'ASQ', year: 2020, notes: 'Quality and process improvement' }
        ]);

        // Meeting state (start with first candidate)
        await db.meetingState.add({
            id: 1,
            currentCandidateId: 1,
            voteOpen: false,
            voteOpenedAt: null
        });
    });

    console.log('Database seeded successfully');
}
