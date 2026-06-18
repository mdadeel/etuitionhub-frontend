import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ChevronDownIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const OrgContextSwitcher = () => {
    const { myOrgs, orgContext, switchOrg } = useAuth();

    if (!myOrgs || myOrgs.length === 0) {
        return null; // Don't show switcher if user has no orgs
    }

    return (
        <div className="relative group inline-block z-50">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
                <span className="truncate max-w-[150px]">
                    {orgContext ? orgContext.orgName : 'Select Organization'}
                </span>
                <ChevronDownIcon className="w-4 h-4 ml-1 text-gray-400" />
            </button>
            
            <div className="absolute right-0 hidden w-56 mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg group-hover:block transition-all duration-200 ease-out z-50">
                <div className="py-1 max-h-60 overflow-y-auto">
                    {myOrgs.map((org) => (
                        <button
                            key={org.orgId}
                            onClick={() => switchOrg(org.orgId)}
                            className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                                orgContext?.orgId === org.orgId
                                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <span className="truncate">{org.orgName}</span>
                            {orgContext?.orgId === org.orgId && (
                                <span className="ml-auto flex shrink-0 items-center">
                                    <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrgContextSwitcher;
