import React, { useState, useEffect } from 'react';
import { getTeamDetailAPI } from '../../api/home/index';
import './TeamMembers.css';

const TeamMembers = () => {
    const [teamMembers, setTeamMembers] = useState([]);

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    const fetchTeamMembers = async () => {
        try {
            const response = await getTeamDetailAPI();
            setTeamMembers(response);
        } catch (error) {
            console.error('Failed to fetch team members:', error);
        }
    };

    return (
        <div className="team-members-container">
            <h5 className='team-members-list-title'>팀 구성원</h5>
            <div className="team-members-list">
                {teamMembers.map((member, index) => (
                    <div key={index} className="team-member-card">
                        <div className="member-profile-image">
                            <img 
                                src={member.profileImageUrl || '/profile_image.png'} 
                                alt={member.name} 
                                className="profile-image"
                            />
                        </div>
                        <div className="member-info">
                            <span className="member-position">{member.position}</span>
                            <span className="member-name">{member.name}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamMembers;