/**
 * PageHeader Component
 * Consistent page titles
 */

const PageHeader = ({ title, subtitle }) => {
    return (
        <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
    );
};

export default PageHeader;
