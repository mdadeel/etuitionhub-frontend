// Statistics Section - platform er stats dekhabe
// numbers hardcode kora ase - later backend theke anbo
// Maybe animation add korbo later? idk
import CountUp from 'react-countup';

// hardcoded stats - TODO: API integration korbo
// const[stats,setStats]=useState([]);
// useEffect(()=>{fetchStats()},[]);  // maybe later
function Statistics() {
    // stats array define kortesi
    // total 4 ta stat ase
    let stats = [
        // tutors count
        { value: 500, label: "Active Tutors", suffix: "+" },
        // students count
        { value: 2000, label: "Happy Students", suffix: "+" },
        // subjects count
        { value: 100, label: "Subjects", suffix: "+" },
        // districts count
        { value: 50, label: "Districts Covered", suffix: "+" }
    ];

    // TODO: API theke dynamic data load korbo
    // fetchStatsFromAPI function likhbo
    // const fetchStatsFromAPI = async () => {
    //     try {
    //         let res = await fetch('http://localhost:5000/api/stats')
    //         if (res.ok) {
    //             let data = await res.json()
    //             setStats(data)
    //         }
    //     } catch (err) {
    //         console.log('stats load hoinai')
    //     }
    // }

    // NOTE: AOS animation comment out korechi
    // <section className="py-16 bg-teal-600 text-white" data-aos="fade-up">

    // return block
    return (
        // stats section container
        // background color teal-600
        <section className="py-16 bg-teal-600 text-white">
            {/* container with padding */}
            <div className="container mx-auto px-4">
                {/* grid layout - 2 columns mobile, 4 columns desktop */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {/* map kortesi stats array */}
                    {stats.map((stat, index) => (
                        // individual stat card
                        <div key={index}>
                            {/* number er div */}
                            <div className="text-4xl font-bold">
                                {/* CountUp component use kortesi animation er jonno */}
                                {/* duration 2.5 seconds */}
                                <CountUp end={stat.value} duration={2.5} />{stat.suffix}
                            </div>
                            {/* label text */}
                            <p className="mt-2 opacity-80">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// component export kortesi
export default Statistics;
