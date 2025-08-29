import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { FiPlus } from "react-icons/fi";
import Button from "../components/common/Button";
import Select from "../components/common/Select";
import TicketList from "../components/tickets/TicketList";
import { useAuth } from "../context/AuthContext";
import { getTickets } from "../services/api";
import Input from "../components/common/Input";

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  margin: 0;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: flex-end;
`;

const FilterGroup = styled.div`
  flex: 1;
  max-width: 200px;
`;

const DateInput = styled.input`
  padding: 8px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  width: 100%;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  border-radius: var(--border-radius-sm);
  background-color: ${(props) =>
    props.active ? "var(--color-primary)" : "var(--color-surface)"};
  color: ${(props) => (props.active ? "white" : "var(--color-text-primary)")};
  border: 1px solid var(--color-border);
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: ${(props) =>
      props.active ? "var(--color-primary)" : "rgba(0, 0, 0, 0.05)"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const FilterRadioGroup = styled.div`
  display: flex;
  gap: 24px;
  margin: 16px 0 24px 0;
  align-items: center;

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--color-text-secondary);

    input[type="radio"] {
      accent-color: var(--color-primary);
      width: 16px;
      height: 16px;
      margin: 0;
    }
  }
`;

const TicketsPage = () => {
  const { isManager, isAgent, isSupport, currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [limit] = useState(50);
  const [tickets, setTickets] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  // const { isManager, isAgent, isSupport, currentUser } = useAuth();
  // const navigate = useNavigate();
  // const [searchParams] = useSearchParams();
  // const [page, setPage] = useState(1)
  // const [limit] = useState(50);
  // const [status, setStatus] = useState('')
  // const [filter,setfilter]=useState(0)
  // const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0],status: '',filter: '0',page: 1,) // Default to today
  // const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]) // Default to today
  // const [tickets, setTickets] = useState([]);
  // const [total, setTotal] = useState(0);
  // const [isLoading, setIsLoading] = useState(false);

  // function handleFilterChange(e){
  //   e.preventDeafaut();
  //   setStartDate(startDate(new Date().toISOString().split('T')[0]));
  // }
  const today = new Date().toISOString().split("T")[0];
  const page = parseInt(searchParams.get("page")) || 1;
  const status = searchParams.get("status") || "";
  const filter = searchParams.get("filter") || "0";
  const startDate = searchParams.get("startDate") || today;
  const endDate = searchParams.get("endDate") || today;

  console.log(searchParams);

  const updateSearchParams = useCallback((updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getTickets(
        startDate,
        endDate,
        page,
        limit,
        status,
        filter,
        currentUser?.id,
        currentUser?.role_id
      );
      setTickets(res?.data?.tickets || []);
      setTotal(res?.data?.total || 0);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate, page, limit, status, filter, currentUser]);


  const handleStartDateChange = (e) => {
    updateSearchParams({
      startDate: e.target.value,
      page: "1", // Reset to first page when changing dates
    });
  };

  const handleEndDateChange = (e) => {
    updateSearchParams({
      endDate: e.target.value,
      page: "1",
    });
  };

  // useEffect(() => {
  //   fetchTickets(currentUser?.role_id,status)
  // }, [startDate, endDate, page, limit, status,filter])

  useEffect(() => {
    // Ensure minimum required params are set
    if (!searchParams.has('page')) {
      updateSearchParams({ page: "1" });
    }
    
    fetchTickets();

    const interval = setInterval(fetchTickets, 120000);
    return () => clearInterval(interval);
  }, [fetchTickets, searchParams, updateSearchParams]);// Add page to dependencies

  const totalPages = Math.ceil(total / limit);

  const handleCreateTicket = () => {
    navigate("/tickets/create");
  };

  const handlePageChange = (newPage) => {
    updateSearchParams({ page: newPage.toString() });
  };

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "reopen", label: "Reopened" },
  ];
  const handlefilter = (e) => {
    updateSearchParams({
      filter: e.target.value,
      page: "1",
    });
  };

  const handlestatus = (e) => {
    updateSearchParams({
      status: e.target.value,
      page: "1",
    });
  };

  return (
    <div>
      <PageHeader>
        <Title>Tickets</Title>

        {(isManager || isAgent) && (
          <Button onClick={handleCreateTicket}>
            <FiPlus size={18} />
            Create Ticket
          </Button>
        )}
      </PageHeader>

      <FiltersContainer>
        {(isAgent || isSupport) && (
          <FilterGroup>
            <Select
              id="filter"
              label="Tickets"
              value={filter}
              onChange={handlefilter}
              options={[
                { label: "My Tickets", value: "0" },
                { label: "All Tickets", value: "1" },
              ]}
            />
          </FilterGroup>
        )}
        <FilterGroup>
          <Select
            id="status"
            label="Status"
            value={status}
            onChange={handlestatus}
            options={statusOptions}
          />
        </FilterGroup>
        <FilterGroup>
          {/* <label htmlFor="startDate">Start Date</label> */}
          <Input
            type="date"
            id="startDate"
            value={startDate}
            onChange={handleStartDateChange}
            max={endDate} // Ensure start date cannot be after end date
          />
        </FilterGroup>
        <FilterGroup>
          {/* <label htmlFor="endDate">End Date</label> */}
          <Input
            type="date"
            id="endDate"
            value={endDate}
            onChange={handleEndDateChange}
            min={startDate} // Ensure end date cannot be before start date
            max={new Date().toISOString().split("T")[0]} // Max date is today
          />
        </FilterGroup>
      </FiltersContainer>

      <TicketList
        tickets={tickets}
        isLoading={isLoading}
        onCreateClick={handleCreateTicket}
        fetchTickets={fetchTickets}
        searchParams={searchParams}
      />

      {totalPages > 1 && (
        <Pagination>
          <PageButton
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </PageButton>

          {[...Array(totalPages)].map((_, i) => (
            <PageButton
              key={i + 1}
              active={page === i + 1}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </PageButton>
          ))}

          <PageButton
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </PageButton>
        </Pagination>
      )}
    </div>
  );
};

export default TicketsPage;
