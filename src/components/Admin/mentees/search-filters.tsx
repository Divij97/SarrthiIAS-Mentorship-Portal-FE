import { MenteesFilters } from "@/services/admin";

interface SearchFiltersProps {
    courses: { id: string; name: string }[];
    groups: { groupId: string; groupFriendlyName: string; course: string }[];
    filters: MenteesFilters;
    onFilterChange: (key: keyof MenteesFilters, value: string | number) => void;

}

export default function SearchFilters({
    courses,
    groups,
    filters,
    onFilterChange
}: SearchFiltersProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
                <label htmlFor="courseFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Course
                </label>
                <select
                    id="courseFilter"
                    value={filters.courseId || ''}
                    onChange={(e) => onFilterChange('courseId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                    <option value="">All Courses</option>
                    {courses.map(course => (
                        <option key={course.id} value={course.id}>
                            {course.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="groupFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Group
                </label>
                <select
                    id="groupFilter"
                    value={filters.groupId || ''}
                    onChange={(e) => onFilterChange('groupId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    disabled={!filters.courseId}
                >
                    <option value="">All Groups</option>
                    {groups
                        .filter(group => !filters.courseId || group.course === filters.courseId)
                        .map(group => (
                            <option key={group.groupId} value={group.groupId}>
                                {group.groupFriendlyName}
                            </option>
                        ))}
                </select>
            </div>

            <div>
                <label htmlFor="limitFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Results per page
                </label>
                <select
                    id="limitFilter"
                    value={filters.limit}
                    onChange={(e) => onFilterChange('limit', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="99999">Show All</option>
                </select>
            </div>
        </div>
    );
}