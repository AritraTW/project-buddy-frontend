import React, { useState, useEffect, useMemo } from "react";
import {
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import Select from "react-select";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaThumbsUp, FaHeart, FaLightbulb, FaAward, FaUserFriends, FaPaperPlane, FaFilter } from 'react-icons/fa';

// --- Define API Base URL ---
const API_BASE_URL = 'http://localhost:4000/api'; // Your backend API URL

// --- Frontend Type Definitions ---
interface MemberData { completed: number; }
interface Sprint { sprint: string; committed: number; completed: number; bugs: number; features: number; chores: number; members: Record<string, MemberData>; }
interface ApiCalendarEvent { title: string; start: string; end: string; cost: number; sprint: string; milestone: string; day: string; }
interface CalendarEventForComponent { title: string; start: Date; end: Date; cost: number; sprint: string; milestone: string; day: string; }
interface Kudos { id: number; sender: string; recipient: string; message: string; tag: string; timestamp: Date; isAnonymous: boolean; }

// --- Color Theme Constants ---
const colors = { primary: '#1972ba', primaryDark: '#145a9a', secondary: '#f68e31', tertiary: '#89b77e', textPrimary: '#231f20', textSecondary: '#808284', background: '#f6f6f6', cardBackground: '#ffffff', success: '#10a958', error: '#ee312c' };
const PIE_CHART_COLORS = [colors.primary, colors.secondary, colors.tertiary];

// --- Constants and Options ---
const localizer = momentLocalizer(moment);
const periodOptions = [ { label: "By Day", value: "day" }, { label: "By Month", value: "month" }, { label: "By Year", value: "year" }];
const filterOptions = [ { label: "By Sprint", value: "sprint" }, { label: "By Milestone", value: "milestone" }];
const kudosTags = [ /* ... kudos tags */
    { value: 'Helpfulness', label: '🤝 Helpfulness', icon: FaUserFriends, color: 'text-blue-500' },
    { value: 'Pairing', label: '🧑‍💻 Pairing', icon: FaUserFriends, color: 'text-green-500' },
    { value: 'Innovation', label: '💡 Innovation', icon: FaLightbulb, color: 'text-yellow-500' },
    { value: 'Above & Beyond', label: '⭐ Above & Beyond', icon: FaAward, color: 'text-purple-500' },
    { value: 'Kindness', label: '💖 Kindness', icon: FaHeart, color: 'text-pink-500' },
    { value: 'Great Work', label: '👍 Great Work', icon: FaThumbsUp, color: 'text-indigo-500' },
];
const kudosTagOptions = kudosTags.map(t => ({ label: t.label, value: t.value }));

// --- Mock Kudos Data ---
const initialKudosData: Kudos[] = [ /* ... initial kudos data */
    { id: 1, sender: 'Alice', recipient: 'Bob', message: 'Thanks for the great pairing session on the auth bug!', tag: 'Pairing', timestamp: new Date(2025, 3, 24, 14, 30), isAnonymous: false },
    { id: 2, sender: 'Charlie', recipient: 'Diana', message: 'Amazing idea for optimizing the build process!', tag: 'Innovation', timestamp: new Date(2025, 3, 23, 10, 0), isAnonymous: false },
    { id: 3, sender: 'Bob', recipient: 'Alice', message: 'Really appreciate you helping me debug that tricky CSS issue.', tag: 'Helpfulness', timestamp: new Date(2025, 3, 22, 16, 15), isAnonymous: false },
    { id: 4, sender: 'System', recipient: 'Evan', message: 'Went above and beyond staying late to fix the deployment!', tag: 'Above & Beyond', timestamp: new Date(2025, 3, 21, 9, 5), isAnonymous: true },
];

// --- Reusable Card Component ---
interface CardProps { title: string; children: React.ReactNode; className?: string; }
const Card: React.FC<CardProps> = ({ title, children, className = "" }) => (
    <div className={`bg-[${colors.cardBackground}] p-4 md:p-6 rounded-xl shadow-md w-full ${className}`}>
        <h2 className={`text-xl md:text-2xl font-semibold mb-4 text-[${colors.textPrimary}]`}>{title}</h2>
        {children}
    </div>
);

// --- Kudos Components (Definitions remain the same) ---
interface KudosCardProps { kudos: Kudos; }
const KudosCard: React.FC<KudosCardProps> = ({ kudos }) => {
    const tagInfo = kudosTags.find(t => t.value === kudos.tag);
    const TagIcon = tagInfo?.icon || FaThumbsUp;
    return ( <div className={`bg-[${colors.cardBackground}] border border-gray-200 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow duration-200`}> <div className="flex items-center mb-2"> <div className={`w-8 h-8 rounded-full bg-gray-300 mr-3 flex items-center justify-center text-[${colors.textSecondary}] font-semibold`}> {kudos.isAnonymous ? '?' : kudos.sender.charAt(0)} </div> <div> <span className={`font-semibold text-[${colors.textPrimary}]`}>{kudos.isAnonymous ? 'Anonymous' : kudos.sender}</span> <span className={`text-[${colors.textSecondary}] mx-1`}>▶</span> <span className={`font-semibold text-[${colors.textPrimary}]`}>{kudos.recipient}</span> </div> {tagInfo && ( <span className={`ml-auto text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 ${tagInfo.color}`}> <TagIcon className="w-3 h-3 mr-1" /> {kudos.tag} </span> )} </div> <p className={`text-[${colors.textPrimary}] mb-2 text-sm`}>{kudos.message}</p> <div className={`text-xs text-[${colors.textSecondary}] text-right`}> {moment(kudos.timestamp).format('MMM D, h:mm A')} </div> <div className="mt-2 flex space-x-2"> <button className={`text-[${colors.textSecondary}] hover:text-blue-500 text-sm`}>👍</button> <button className={`text-[${colors.textSecondary}] hover:text-red-500 text-sm`}>💖</button> <button className={`text-[${colors.textSecondary}] hover:text-yellow-500 text-sm`}>🎉</button> </div> </div> );
};

interface KudosFormProps { onSubmit: (newKudos: Omit<Kudos, 'id' | 'timestamp'>) => void; currentUser: string; allMembersOptions: { label: string; value: string }[]; }
const KudosForm: React.FC<KudosFormProps> = ({ onSubmit, currentUser, allMembersOptions }) => {
    const [recipient, setRecipient] = useState<any>(null); const [tag, setTag] = useState<any>(null); const [message, setMessage] = useState(''); const [isAnonymous, setIsAnonymous] = useState(false);
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!recipient || !tag || !message.trim()) { alert("Please select recipient, tag, and enter a message."); return; } onSubmit({ sender: currentUser, recipient: recipient.value, tag: tag.value, message, isAnonymous }); setRecipient(null); setTag(null); setMessage(''); setIsAnonymous(false); };
    return ( <form onSubmit={handleSubmit} className={`bg-[${colors.cardBackground}] p-4 rounded-lg border border-gray-200 shadow-sm mb-4`}> <h3 className={`text-lg font-semibold mb-3 text-[${colors.textPrimary}]`}>Send Kudos 🌟</h3> <div className="mb-3"> <label className={`block text-sm font-medium text-[${colors.textSecondary}] mb-1`}>To:</label> <Select options={allMembersOptions.filter(m => m.value !== currentUser)} value={recipient} onChange={setRecipient} placeholder="Select recipient..." isClearable classNamePrefix="react-select"/> </div> <div className="mb-3"> <label className={`block text-sm font-medium text-[${colors.textSecondary}] mb-1`}>Tag:</label> <Select options={kudosTagOptions} value={tag} onChange={setTag} placeholder="Select tag..." isClearable classNamePrefix="react-select"/> </div> <div className="mb-3"> <label className={`block text-sm font-medium text-[${colors.textSecondary}] mb-1`}>Message:</label> <textarea value={message} onChange={(e) => setMessage(e.target.value)} className={`w-full p-2 border rounded-md focus:ring-[${colors.primary}] focus:border-[${colors.primary}] text-sm`} rows={3} placeholder="Share your appreciation..." required /> </div> <div className="mb-4"> <label className={`flex items-center text-sm text-[${colors.textSecondary}]`}> <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className={`mr-2 h-4 w-4 text-[${colors.primary}] border-gray-300 rounded focus:ring-[${colors.primary}]`}/> Send Anonymously </label> </div> <button type="submit" className={`w-full bg-[${colors.primary}] hover:bg-[${colors.primaryDark}] text-white font-bold py-2 px-4 rounded-lg inline-flex items-center justify-center transition-colors duration-200 text-sm`}> <FaPaperPlane className="mr-2"/> Send Kudos </button> </form> );
};

interface KudosFiltersProps { onFilterChange: (filters: { recipient: string | null; tag: string | null }) => void; allMembersOptions: { label: string; value: string }[]; }
const KudosFilters: React.FC<KudosFiltersProps> = ({ onFilterChange, allMembersOptions }) => {
    const [selectedRecipient, setSelectedRecipient] = useState<any>(null); const [selectedTag, setSelectedTag] = useState<any>(null);
    useEffect(() => { onFilterChange({ recipient: selectedRecipient?.value || null, tag: selectedTag?.value || null }); }, [selectedRecipient, selectedTag, onFilterChange]);
    return ( <div className={`bg-[${colors.cardBackground}] p-4 rounded-lg border border-gray-200 shadow-sm mb-4`}> <h3 className={`text-lg font-semibold mb-3 text-[${colors.textPrimary}] inline-flex items-center`}><FaFilter className="mr-2"/> Filters</h3> <div className="space-y-3"> <div> <label className={`block text-sm font-medium text-[${colors.textSecondary}] mb-1`}>Filter by Recipient:</label> <Select options={allMembersOptions} value={selectedRecipient} onChange={setSelectedRecipient} placeholder="All Recipients" isClearable classNamePrefix="react-select"/> </div> <div> <label className={`block text-sm font-medium text-[${colors.textSecondary}] mb-1`}>Filter by Tag:</label> <Select options={kudosTagOptions} value={selectedTag} onChange={setSelectedTag} placeholder="All Tags" isClearable classNamePrefix="react-select"/> </div> </div> </div> );
};


// --- Main Dashboard Component ---
export default function RetroBuddyDashboard(): JSX.Element {
    // --- State Variables ---
    const [selectedMemberVelocity, setSelectedMemberVelocity] = useState<string | null>(null);
    const [hourlyRate, setHourlyRate] = useState<number>(50);
    const [meetingTime, setMeetingTime] = useState<number>(1);
    const [timePeriod, setTimePeriod] = useState<string>("day");
    const [filterBy, setFilterBy] = useState<string>("sprint");
    const [selectedSprintFilter, setSelectedSprintFilter] = useState<string>("");
    const [selectedMilestoneFilter, setSelectedMilestoneFilter] = useState<string>("");
    const [selectedSprintIndexes, setSelectedSprintIndexes] = useState<number[]>([]);
    const [member1, setMember1] = useState<string>("");
    const [member2, setMember2] = useState<string>("");
    const [kudosList, setKudosList] = useState<Kudos[]>(initialKudosData);
    const [kudosFilters, setKudosFilters] = useState<{ recipient: string | null; tag: string | null }>({ recipient: null, tag: null });
    const [currentUser] = useState<string>('Entire Team');
    const [selectedPieSprintIndex, setSelectedPieSprintIndex] = useState<number | null>(null);
    const [sprints, setSprints] = useState<Sprint[]>([]);
    const [calendarEvents, setCalendarEvents] = useState<CalendarEventForComponent[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // --- Data Fetching ---
    useEffect(() => {
        // ... (fetchData function remains the same as the previous version) ...
        const fetchData = async () => {
            setIsLoading(true); setError(null); let initialMember1 = 'Alice'; let initialMember2 = 'Bob';
            try {
                const [sprintRes, eventRes] = await Promise.all([ fetch(`${API_BASE_URL}/sprints`), fetch(`${API_BASE_URL}/calendar-events`) ]);
                if (!sprintRes.ok) throw new Error(`Sprints API error! status: ${sprintRes.status}`);
                const fetchedSprints: Sprint[] = await sprintRes.json(); setSprints(fetchedSprints);
                if (fetchedSprints.length > 0) {
                    setSelectedSprintIndexes(fetchedSprints.map((_, index) => index)); setSelectedPieSprintIndex(fetchedSprints.length - 1);
                    const membersList = Object.keys(fetchedSprints[0]?.members || {});
                    if (membersList.length > 0) initialMember1 = membersList[0]; if (membersList.length > 1) initialMember2 = membersList[1]; else if (membersList.length === 1) initialMember2 = 'Team';
                } setMember1(initialMember1); setMember2(initialMember2);
                if (!eventRes.ok) throw new Error(`Events API error! status: ${eventRes.status}`);
                const fetchedEvents: ApiCalendarEvent[] = await eventRes.json();
                const processedEventsForComponent: CalendarEventForComponent[] = fetchedEvents.map(event => ({ ...event, start: new Date(event.start), end: new Date(event.end), })); setCalendarEvents(processedEventsForComponent);
                const uniqueFetchedSprints = [...new Set(processedEventsForComponent.map(e => e.sprint))].sort(); const uniqueFetchedMilestones = [...new Set(processedEventsForComponent.map(e => e.milestone))].sort();
                if (uniqueFetchedSprints.length > 0) setSelectedSprintFilter(uniqueFetchedSprints[0]); if (uniqueFetchedMilestones.length > 0) setSelectedMilestoneFilter(uniqueFetchedMilestones[0]);
            } catch (e: any) { console.error("Failed to fetch data:", e); setError(`Failed to load dashboard data. Please ensure the API server is running at ${API_BASE_URL}. Error: ${e.message}`);
            } finally { setIsLoading(false); }
        };
        fetchData();
    }, []);

    // --- Derived Data & Calculations ---
    // ... (all useMemo hooks remain the same as the previous version) ...
    const members = useMemo(() => { return sprints.length > 0 && sprints[0].members ? Object.keys(sprints[0].members) : []; }, [sprints]);
    const allMembersOptions = useMemo(() => members.map(m => ({ label: m, value: m })), [members]);
    const velocityMemberOptions = useMemo(() => [{ label: "Entire Team", value: null }, ...allMembersOptions], [allMembersOptions]);
    const memberComparisonOptions = useMemo(() => [{ label: "Entire Team", value: "Team" }, ...allMembersOptions], [allMembersOptions]);
    const sprintOptions = useMemo(() => sprints.map((s, index) => ({ label: s.sprint, value: index })), [sprints]);
    const sprintFilterOptions = useMemo(() => { const u = [...new Set(calendarEvents.map(e => e.sprint))].sort(); return u.map(s => ({ label: s, value: s })); }, [calendarEvents]);
    const milestoneFilterOptions = useMemo(() => { const u = [...new Set(calendarEvents.map(e => e.milestone))].sort(); return u.map(m => ({ label: m, value: m })); }, [calendarEvents]);
    const selectedSprintDataForPie = useMemo(() => { if (selectedPieSprintIndex !== null && sprints[selectedPieSprintIndex]) { return sprints[selectedPieSprintIndex]; } return null; }, [sprints, selectedPieSprintIndex]);
    const pieData = useMemo(() => { if (!selectedSprintDataForPie) return []; return [ { name: "Bugs", value: selectedSprintDataForPie.bugs }, { name: "Features", value: selectedSprintDataForPie.features }, { name: "Chores", value: selectedSprintDataForPie.chores }]; }, [selectedSprintDataForPie]);
    const currentSprintForInsights = useMemo(() => { return sprints.length > 0 ? sprints[sprints.length - 1] : null; }, [sprints]);
    const velocityData = useMemo(() => sprints.map((s) => ({ sprint: s.sprint, committed: s.committed, completed: selectedMemberVelocity ? s.members[selectedMemberVelocity]?.completed ?? 0 : s.completed, })), [sprints, selectedMemberVelocity]);
    const memberComparisonData = useMemo(() => sprints .filter((_, index) => selectedSprintIndexes.includes(index)) .map((s) => ({ sprint: s.sprint, [member1]: member1 === "Team" ? s.completed : s.members[member1]?.completed ?? 0, [member2]: member2 === "Team" ? s.completed : s.members[member2]?.completed ?? 0, })), [sprints, selectedSprintIndexes, member1, member2]);
    const numberOfParticipants = members.length;
    const calculateSingleMeetingCost = (rate: number, time: number, participants: number): number => rate * time * participants;
    const singleMeetingCost = calculateSingleMeetingCost(hourlyRate, meetingTime, numberOfParticipants);
    const calculateCostSavingsMessage = (cost: number): string => { return cost > (50*1*numberOfParticipants) ? "Potential..." : cost > (25*1*numberOfParticipants) ? "Moderate..." : "Meeting cost..."; };
    const aggregatedCostChartData = useMemo(() => { const f = calendarEvents.filter((data) => { const mS=filterBy==="sprint"?data.sprint===selectedSprintFilter:true; const mM=filterBy==="milestone"?data.milestone===selectedMilestoneFilter:true; return mS&&mM; }); const m = f.reduce((acc, data) => { let pK=""; if(timePeriod==='day') pK=data.day??'Unk'; else if(timePeriod==='month') pK=moment(data.start).format('YYYY-MM'); else pK=moment(data.start).format('YYYY'); if(!acc[pK]) acc[pK]=0; acc[pK]+=data.cost; return acc; }, {} as Record<string,number>); return Object.keys(m).map((key)=>({period:key,cost:m[key]})).sort((a,b)=>(a.period<b.period?-1:1)); }, [calendarEvents, timePeriod, filterBy, selectedSprintFilter, selectedMilestoneFilter]);
    const filteredKudos = kudosList.filter(k => { const rM=!kudosFilters.recipient||k.recipient===kudosFilters.recipient; const tM=!kudosFilters.tag||k.tag===kudosFilters.tag; return rM&&tM; }).sort((a,b)=>b.timestamp.getTime()-a.timestamp.getTime());

    // --- Event Handlers ---
    // ... (Handlers remain the same, including handlePieSprintChange) ...
    const handleMemberVelocityChange = (selectedOption: any) => setSelectedMemberVelocity(selectedOption?.value || null);
    const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => { const nR=Number(e.target.value)||0; setHourlyRate(nR<0?0:nR); };
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => { const nT=Number(e.target.value)||0; setMeetingTime(nT<0?0:nT); };
    const handlePeriodChange = (selectedOption: any) => setTimePeriod(selectedOption?.value || "day");
    const handleFilterTypeChange = (selectedOption: any) => setFilterBy(selectedOption?.value || "sprint");
    const handleSprintFilterChange = (selectedOption: any) => setSelectedSprintFilter(selectedOption?.value || "");
    const handleMilestoneFilterChange = (selectedOption: any) => setSelectedMilestoneFilter(selectedOption?.value || "");
    const handleSprintSelectionChange = (selectedOptions: readonly any[]) => setSelectedSprintIndexes(selectedOptions ? selectedOptions.map(opt => opt.value) : []);
    const handleMember1Change = (selectedOption: any) => setMember1(selectedOption?.value || "");
    const handleMember2Change = (selectedOption: any) => setMember2(selectedOption?.value || "");
    const handleKudosSubmit = (newKudosData: Omit<Kudos, 'id' | 'timestamp'>) => { const newKudos: Kudos = { ...newKudosData, id: Date.now(), timestamp: new Date() }; setKudosList(prevKudos => [newKudos, ...prevKudos]); console.log("Kudos submitted:", newKudos); };
    const handleKudosFilterChange = (filters: { recipient: string | null; tag: string | null }) => { setKudosFilters(filters); };
    const handlePieSprintChange = (selectedOption: any) => { setSelectedPieSprintIndex(selectedOption?.value ?? null); };

    // --- JSX ---

    // Loading State
    if (isLoading) { return <div className={`flex justify-center items-center min-h-screen text-xl font-semibold text-[${colors.textPrimary}] bg-[${colors.background}]`}>Loading Dashboard Data...</div>; }

    // Error State
    if (error) { return <div className={`flex flex-col justify-center items-center min-h-screen text-[${colors.error}] text-center p-4 bg-[${colors.background}]`}> <p className="text-xl font-semibold mb-2">Error Loading Dashboard</p> <p className="text-sm">{error}</p> </div>; }

    // Main Render
    return (
        <div className={`p-4 md:p-6 font-sans bg-[${colors.background}] min-h-screen`}>
            <h1 className={`text-3xl md:text-4xl font-extrabold mb-6 md:mb-8 text-center text-[${colors.textPrimary}]`}>
                Project Buddy Dashboard
            </h1>

            {/* **MODIFIED LAYOUT**: Use Flexbox for 70/30 column split */}
            <div className="flex flex-col lg:flex-row gap-6">

                {/* Left Column: Dashboard Cards (70% width) */}
                <div className="w-full lg:w-[70%] flex-shrink-0 space-y-6">
                    {/* Card: Velocity Trend */}
                    <Card title="Velocity Trend (All Sprints)">
                        <div className="mb-4">
                            <label className={`block text-[${colors.textSecondary}] font-medium mb-1 text-sm`}> Filter by Team Member </label>
                            <Select options={velocityMemberOptions} onChange={handleMemberVelocityChange} isClearable placeholder="Entire Team" value={velocityMemberOptions.find(opt => opt.value === selectedMemberVelocity)} className="text-sm" classNamePrefix="react-select"/>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={velocityData}>
                                <CartesianGrid strokeDasharray="3 3" /> <XAxis dataKey="sprint" /> <YAxis /> <Tooltip /> <Legend />
                                <Line type="monotone" dataKey="committed" stroke={colors.primary} strokeWidth={2} name="Committed" />
                                <Line type="monotone" dataKey="completed" stroke={colors.secondary} strokeWidth={2} name={selectedMemberVelocity ? `${selectedMemberVelocity}'s Completed` : "Team Completed"} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Card: Work Breakdown with Dropdown */}
                    <Card title={`Work Breakdown (${selectedSprintDataForPie?.sprint || 'Select Sprint'})`}>
                        <div className="mb-4">
                            <label className={`block text-[${colors.textSecondary}] font-medium mb-1 text-sm`}> Select Sprint: </label>
                            <Select
                                options={sprintOptions}
                                value={sprintOptions.find(option => option.value === selectedPieSprintIndex)}
                                onChange={handlePieSprintChange}
                                placeholder="Select Sprint"
                                isClearable={false}
                                className="text-sm"
                                classNamePrefix="react-select"
                            />
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => { const RADIAN=Math.PI/180; const radius=innerRadius+(outerRadius-innerRadius)*0.5; const x=cx+radius*Math.cos(-midAngle*RADIAN); const y=cy+radius*Math.sin(-midAngle*RADIAN); const name=pieData[index]?.name ?? ''; return (<text x={x} y={y} fill={colors.cardBackground} textAnchor={x>cx?'start':'end'} dominantBaseline="central" fontSize="11">{`${name} (${(percent*100).toFixed(0)}%)`}</text>); }}>
                                    {pieData.map((entry, index) => ( <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} /> ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => `${value} points`}/> <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Card: Sprint Insights (Uses latest sprint data) */}
                    {currentSprintForInsights && (
                        <Card title={`Latest Sprint Insights (${currentSprintForInsights.sprint})`}>
                            <ul className={`list-disc ml-6 space-y-2 text-[${colors.textPrimary}] text-sm md:text-base`}>
                                {currentSprintForInsights.completed < currentSprintForInsights.committed * 0.7 && ( <li> <span className={`font-semibold text-[${colors.secondary}]`}>⚠️ Low Completion Rate:</span> Sprint completed significantly less than committed ({currentSprintForInsights.completed}/{currentSprintForInsights.committed} points). Investigate blockers or potential overestimation. </li> )}
                                {currentSprintForInsights.completed >= currentSprintForInsights.committed && ( <li> <span className={`font-semibold text-[${colors.success}]`}>✅ Commitment Met/Exceeded:</span> Great job finishing the committed work ({currentSprintForInsights.completed}/{currentSprintForInsights.committed} points)! </li> )}
                                {currentSprintForInsights.bugs > 10 && ( <li> <span className={`font-semibold text-[${colors.error}]`}>🐞 High Bug Count:</span> {currentSprintForInsights.bugs} bugs were part of the completed work. Consider focusing on quality improvement. </li> )}
                                {currentSprintForInsights.bugs <= 5 && currentSprintForInsights.bugs > 0 && ( <li> <span className={`font-semibold text-[${colors.secondary}]`}>🦟 Moderate Bug Count:</span> {currentSprintForInsights.bugs} bugs completed. Keep an eye on quality practices. </li> )}
                                {currentSprintForInsights.features < 15 && currentSprintForInsights.completed > 0 && ( <li> <span className={`font-semibold text-[${colors.primary}]`}>📉 Low Feature Output:</span> Only {currentSprintForInsights.features} feature points delivered. Review planning or available development bandwidth if feature delivery is a priority. </li> )}
                                {currentSprintForInsights.features >= 15 && ( <li> <span className={`font-semibold text-[${colors.success}]`}>🚀 Good Feature Output:</span> {currentSprintForInsights.features} feature points delivered. Keep up the momentum! </li> )}
                                <li> <span className="font-semibold text-purple-600">🤖 AI Suggestion:</span> Based on the data, consider if the balance between bug fixes ({currentSprintForInsights.bugs} points), features ({currentSprintForInsights.features} points), and chores ({currentSprintForInsights.chores} points) aligns with the team's goals for the next sprint. </li>
                            </ul>
                        </Card>
                    )}

                    {/* Card: Team Member Comparison */}
                    <Card title="Team Member Comparison">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 border-b pb-4">
                            <div> <label className={`block text-[${colors.textSecondary}] font-medium mb-1 text-sm`}> Select Sprint(s) </label> <Select isMulti options={sprintOptions} value={sprintOptions.filter(option => selectedSprintIndexes.includes(option.value))} onChange={handleSprintSelectionChange} className="text-sm" classNamePrefix="react-select" placeholder="Select sprints..." /> </div>
                            <div> <label className={`block text-[${colors.textSecondary}] font-medium mb-1 text-sm`}> Compare Member 1 </label> <Select options={memberComparisonOptions} value={memberComparisonOptions.find(opt => opt.value === member1)} onChange={handleMember1Change} className="text-sm" classNamePrefix="react-select" /> </div>
                            <div> <label className={`block text-[${colors.textSecondary}] font-medium mb-1 text-sm`}> Compare Member 2 </label> <Select options={memberComparisonOptions} value={memberComparisonOptions.find(opt => opt.value === member2)} onChange={handleMember2Change} className="text-sm" classNamePrefix="react-select" /> </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={memberComparisonData}>
                                <CartesianGrid strokeDasharray="3 3" /> <XAxis dataKey="sprint" /> <YAxis label={{ value: 'Completed Points', angle: -90, position: 'insideLeft', fill: colors.textSecondary }} style={{ fontSize: '0.8rem' }} /> <Tooltip /> <Legend />
                                <Line type="monotone" dataKey={member1} stroke={colors.primary} strokeWidth={2} name={member1} />
                                <Line type="monotone" dataKey={member2} stroke={colors.secondary} strokeWidth={2} name={member2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>

                    {/*/!* Card: Single Meeting Cost Calculator *!/*/}
                    {/*<Card title="Calculate Meeting Cost">*/}
                    {/*    <p className={`text-sm text-[${colors.textSecondary}] mb-3`}>Estimate the cost of a single meeting for the entire team ({numberOfParticipants} participants).</p>*/}
                    {/*    <div className="mb-4"> <label className={`block text-[${colors.textSecondary}] font-medium mb-1`}> Avg. Hourly Rate per Participant ($) </label> <input type="number" value={hourlyRate} onChange={handleRateChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[${colors.primary}]`} placeholder="e.g., 50" min="0"/> </div>*/}
                    {/*    <div className="mb-4"> <label className={`block text-[${colors.textSecondary}] font-medium mb-1`}> Time Spent in Meeting (Hours) </label> <input type="number" value={meetingTime} onChange={handleTimeChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[${colors.primary}]`} placeholder="e.g., 1" min="0" step="0.25"/> </div>*/}
                    {/*    <div className="mt-4 border-t pt-4"> <p className={`text-lg font-semibold text-[${colors.textPrimary}]`}> Estimated Cost of This Meeting: <span className={`font-bold ml-2 text-[${colors.primary}]`}> ${singleMeetingCost.toFixed(2)}</span> </p> <p className={`text-sm text-[${colors.textSecondary}] mt-2`}> {calculateCostSavingsMessage(singleMeetingCost)} </p> </div>*/}
                    {/*</Card>*/}

                    {/* Card: Aggregated Meeting Costs */}
                    <Card title="Aggregated Meeting Costs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 border-b pb-4">
                            <div> <label className={`block text-[${colors.textSecondary}] font-medium mb-1 text-sm`}> Aggregate By </label> <Select options={periodOptions} onChange={handlePeriodChange} value={periodOptions.find(opt => opt.value === timePeriod)} className="text-sm" classNamePrefix="react-select"/> </div>
                            <div> <label className={`block text-[${colors.textSecondary}] font-medium mb-1 text-sm`}> Filter By </label> <Select options={filterOptions} onChange={handleFilterTypeChange} value={filterOptions.find(opt => opt.value === filterBy)} className="text-sm" classNamePrefix="react-select"/> </div>
                            {filterBy === "sprint" && ( <div> <label className={`block text-[${colors.textSecondary}] font-medium mb-1 text-sm`}> Select Sprint </label> <Select options={sprintFilterOptions} onChange={handleSprintFilterChange} value={sprintFilterOptions.find(opt => opt.value === selectedSprintFilter)} placeholder="All Sprints" isClearable className="text-sm" classNamePrefix="react-select"/> </div> )}
                            {filterBy === "milestone" && ( <div> <label className={`block text-[${colors.textSecondary}] font-medium mb-1 text-sm`}> Select Milestone </label> <Select options={milestoneFilterOptions} onChange={handleMilestoneFilterChange} value={milestoneFilterOptions.find(opt => opt.value === selectedMilestoneFilter)} placeholder="All Milestones" isClearable className="text-sm" classNamePrefix="react-select"/> </div> )}
                        </div>
                        <h3 className={`text-lg md:text-xl font-semibold mb-4 text-[${colors.textPrimary}]`}> Costs by {timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} {filterBy === 'sprint' && selectedSprintFilter && ` (Sprint: ${selectedSprintFilter})`} {filterBy === 'milestone' && selectedMilestoneFilter && ` (Milestone: ${selectedMilestoneFilter})`} </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={aggregatedCostChartData}>
                                <CartesianGrid strokeDasharray="3 3" /> <XAxis dataKey="period" /> <YAxis /> <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} /> <Legend />
                                <Bar dataKey="cost" fill={colors.primary} name="Total Meeting Cost"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Card: Meeting Calendar */}
                    <Card title="Meeting Calendar">
                        <div style={{ height: 500 }}>
                            <Calendar localizer={localizer} events={calendarEvents} startAccessor="start" endAccessor="end" style={{ height: '100%' }} tooltipAccessor={(event: any) => `${event.title} - Cost: $${event.cost}`} />
                        </div>
                    </Card>
                </div>

                {/* Right Column: Kudos Chat (30% width, Sticky) */}
                <div className="w-full lg:w-[30%] flex-shrink-0 lg:sticky lg:top-6 lg:max-h-[calc(100vh-4rem)] space-y-6">
                    {/* Scrollable wrapper for the entire Kudos column content */}
                    <div className="lg:overflow-y-auto lg:max-h-[calc(100vh-4rem)] space-y-6 custom-scrollbar">
                        <KudosForm onSubmit={handleKudosSubmit} currentUser={currentUser} allMembersOptions={allMembersOptions} />
                        <KudosFilters onFilterChange={handleKudosFilterChange} allMembersOptions={allMembersOptions} />
                        <div className={`bg-[${colors.cardBackground}] p-4 rounded-lg border border-gray-200 shadow-sm`}>
                            <h3 className={`text-lg font-semibold mb-3 text-[${colors.textPrimary}]`}>Kudos Feed 🎉</h3>
                            <div className="max-h-[60vh] lg:max-h-[calc(100vh-28rem)] overflow-y-auto pr-2 custom-scrollbar">
                                {filteredKudos.length > 0 ? (
                                    filteredKudos.map(k => <KudosCard key={k.id} kudos={k} />)
                                ) : (
                                    <p className={`text-[${colors.textSecondary}] text-center py-4`}>No kudos match the current filters.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div> {/* End Flexbox Row */}

            {/* Custom Scrollbar & Select/Calendar Styles */}
            <style jsx global>{`
                /* ... Scrollbar, Select, Calendar styles remain the same ... */
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #c5c5c5; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
                .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #c5c5c5 #f1f1f1; }
                .react-select__control { border-color: #d1d5db !important; box-shadow: none !important; font-size: 0.875rem !important; }
                .react-select__control--is-focused { border-color: ${colors.primary} !important; box-shadow: 0 0 0 1px ${colors.primary} !important; }
                .react-select__option { font-size: 0.875rem !important; }
                .react-select__option--is-selected { background-color: ${colors.primary} !important; color: white !important; }
                .react-select__option--is-focused { background-color: #e0e7ff !important; color: ${colors.textPrimary} !important; }
                .react-select__multi-value { background-color: #e0e7ff !important; font-size: 0.875rem !important; }
                .react-select__multi-value__label { color: ${colors.primary} !important; }
                .react-select__multi-value__remove:hover { background-color: ${colors.primary} !important; color: white !important; }
                .rbc-toolbar button { background-color: ${colors.primary} !important; color: white !important; border: none !important; padding: 0.3rem 0.7rem !important; border-radius: 0.375rem !important; transition: background-color 0.2s ease-in-out !important; }
                .rbc-toolbar button:hover, .rbc-toolbar button:focus { background-color: ${colors.primaryDark} !important; }
                .rbc-toolbar button:active, .rbc-btn-group > button:not(:first-child):not(:last-child) { background-color: ${colors.primary} !important; }
                .rbc-active { background-color: ${colors.primaryDark} !important; }
                .rbc-event { background-color: ${colors.secondary} !important; border: 1px solid ${colors.secondary} !important; font-size: 0.75rem !important; color: ${colors.textPrimary} !important; }
                .rbc-event.rbc-selected { background-color: ${colors.primary} !important; border: 1px solid ${colors.primary} !important; }
            `}</style>
        </div> // End Main Container
    );
}