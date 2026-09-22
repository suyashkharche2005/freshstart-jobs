import { useEffect, useState } from "react";
import api from "../services/api";
import JobCard from "../components/JobCard";
import { Empty, Loader } from "../components/UI";

export default function Jobs() {
    const [query, setQuery] = useState({
        search: "",
        location: "",
        workMode: "",
        type: "",
        sort: "newest",
        page: 1
    });

    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    const loadJobs = async (currentQuery = query) => {
        setError("");

        try {
            const response = await api.get("/jobs", {
                params: currentQuery
            });

            setData(response.data);
        } catch (requestError) {
            setError(requestError.message);
        }
    };

    useEffect(() => {
        loadJobs();
    }, [query.page, query.sort]);

    const handleSearch = (event) => {
        event.preventDefault();

        if (query.page === 1) {
            loadJobs();
        } else {
            setQuery({
                ...query,
                page: 1
            });
        }
    };

    const handleSortChange = (event) => {
        setQuery({
            ...query,
            sort: event.target.value,
            page: 1
        });
    };

    const goToPreviousPage = () => {
        setQuery({
            ...query,
            page: query.page - 1
        });
    };

    const goToNextPage = () => {
        setQuery({
            ...query,
            page: query.page + 1
        });
    };

    return (
        <main className="page container">
            <div className="page-heading">
                <span className="eyebrow">
                    FRESHER-FRIENDLY ROLES
                </span>

                <h1>Find work worth starting</h1>

                <p>
                    Search verified entry-level opportunities from teams
                    ready to invest in new talent.
                </p>
            </div>

            <form className="filters" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Job title, company, or skill"
                    value={query.search}
                    onChange={(event) =>
                        setQuery({
                            ...query,
                            search: event.target.value
                        })
                    }
                />

                <input
                    type="text"
                    placeholder="City or location"
                    value={query.location}
                    onChange={(event) =>
                        setQuery({
                            ...query,
                            location: event.target.value
                        })
                    }
                />

                <select
                    value={query.workMode}
                    onChange={(event) =>
                        setQuery({
                            ...query,
                            workMode: event.target.value
                        })
                    }
                >
                    <option value="">Any work mode</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                </select>

                <select
                    value={query.type}
                    onChange={(event) =>
                        setQuery({
                            ...query,
                            type: event.target.value
                        })
                    }
                >
                    <option value="">Any job type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                </select>

                <button className="btn" type="submit">
                    Search
                </button>
            </form>

            <div className="result-toolbar">
                <strong>
                    {data ? `${data.pagination.total} opportunities` : "Jobs"}
                </strong>

                <label className="sort-control">
                    <span>Sort by</span>

                    <select
                        value={query.sort}
                        onChange={handleSortChange}
                    >
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                        <option value="deadline">
                            Application deadline
                        </option>
                    </select>
                </label>
            </div>

            {error && (
                <div className="alert error">
                    {error}
                </div>
            )}

            {!data ? (
                <Loader />
            ) : data.jobs.length > 0 ? (
                <>
                    <div className="job-grid">
                        {data.jobs.map((job) => (
                            <JobCard
                                key={job._id}
                                job={job}
                            />
                        ))}
                    </div>

                    <div className="pagination">
                        <button
                            type="button"
                            disabled={query.page <= 1}
                            onClick={goToPreviousPage}
                        >
                            Previous
                        </button>

                        <span>
                            Page {data.pagination.page} of{" "}
                            {data.pagination.pages}
                        </span>

                        <button
                            type="button"
                            disabled={
                                query.page >= data.pagination.pages
                            }
                            onClick={goToNextPage}
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <Empty
                    title="No matching jobs"
                    text="Try a broader title, location, or work mode."
                />
            )}
        </main>
    );
}