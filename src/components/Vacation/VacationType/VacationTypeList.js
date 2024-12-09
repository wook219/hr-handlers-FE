import React from 'react';
import VacationType from './VacationType';
import { 
    Tent,      // 연차
    Clock,     // 반차
    Pill,      // 병가
    Building   // 공가
} from 'lucide-react';
import './VacationType.css';

const VacationTypeList = ({ remainingDays, onVacationUpdate }) => {
    const vacationTypes = [
        { icon: Tent, title: "연차", type: "ANNUAL" },
        { icon: Clock, title: "반차", type: "HALF" },
        { icon: Pill, title: "병가", type: "SICK" },
        { icon: Building, title: "공가", type: "PUBLIC" }
    ];

    return (
        <section className="vacation-types-section">
            {vacationTypes.map((vType) => (
                <VacationType 
                    key={vType.type}
                    icon={vType.icon}
                    title={vType.title}
                    type={vType.type}
                    remainingDays={remainingDays}
                    onVacationUpdate={onVacationUpdate}
                />
            ))}
        </section>
    );
};

export default VacationTypeList;