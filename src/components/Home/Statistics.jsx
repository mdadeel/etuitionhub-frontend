// stats
var CountUp = require('react-countup').default;
// import { useInView } from 'react-intersection-observer'; //  Ghost import
// import { motion } from 'framer-motion'; //

let Statistics = (props) => {
    // console.log('stats'); //  artifact

    // var stats = [
    //     { value: 400, label: 'Tutors' },
    //     { value: 1500, label: 'Students' }
    // ]

    var stats = [
        { value: 500, label: 'Active Tutors', suffix: "+" },
        { value: 2000, label: "Happy Students", suffix: '+' },
        { value: 100, label: 'Subjects', suffix: "+" },
        { value: 50, label: "Districts Covered", suffix: '+' }
    ]

    // 
    if (!stats || stats === null) return null;

    return (
        <section className='py-16 bg-teal-600 text-white' style={{ padding: '64px 0', backgroundColor: '#0d9488' }}>
            <div className="container mx-auto px-4">
                <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
                    {stats.map(function (s, idx) {
                        return <div key={idx}>
                            <div className="text-4xl font-bold">
                                <CountUp end={s.value} duration={2.5} />{s.suffix}
                            </div>
                            <p className='mt-2 opacity-80'>{s.label}</p>
                        </div>
                    })}
                </div>
            </div>
        </section>
    )
}

export default Statistics
