import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { toast } from 'react-fox-toast'
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import { deleteuser, getRoles, getUsers } from '../services/api'


const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`

const Title = styled.h1`
  margin: 0;
`

const FiltersContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`

const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;
  
  @media (max-width: 768px) {
    min-width: 100%;
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-bottom: 24px;
`

const TableHead = styled.thead`
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
`

const TableHeader = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
`

const TableBody = styled.tbody`
  background-color: var(--color-surface);
`

const TableRow = styled.tr`
  border-bottom: 1px solid var(--color-border);
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
  
  [data-theme='dark'] &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`

const TableCell = styled.td`
  padding: 16px;
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border);
`

const ActionButton = styled(Button)`
  padding: 6px 12px;
  margin-right: 8px;
`

const StatusIndicator = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.active ? 'var(--color-success)' : 'var(--color-error)'};
  margin-right: 8px;
`

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
`

const PageButton = styled.button`
  padding: 8px 12px;
  border-radius: var(--border-radius-sm);
  background-color: ${props => props.active ? 'var(--color-primary)' : 'var(--color-surface)'};
  color: ${props => props.active ? 'white' : 'var(--color-text-primary)'};
  border: 1px solid var(--color-border);
  cursor: pointer;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.active ? 'var(--color-primary)' : 'rgba(0, 0, 0, 0.05)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const UsersPage = () => {
  const navigate = useNavigate()

  const [page, setPage] = useState(1)
  const [limit] = useState(25)
  const [roleFilter, setRoleFilter] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading,setloading]=useState(false)
  const [users,setUsers]=useState([])
  const [rolesData,setrolesData]=useState([])

  const total = users?.length || 0
  const totalPages = Math.ceil(total / limit)
  
  const roleOptions = rolesData?.map(role => ({
    value: role.id,
    label: role.name
  })) || []
  
  roleOptions.unshift({ value: 0, label: 'All Roles' })
  
  const handleDeleteUser = async(id) => {
 console.log(id)
    try {
      let response=await deleteuser(id);
      
    if(response.status=='success'){
      fetchusers()
      toast.success(response.message)

    }
    if(response.status=='failure'){
      toast.error(response.message)
    }
    } catch (error) {
      console.log(error)
    }
    
  }
  
  const handleCreateUser = () => {
    navigate('/users/create')
  }
  
  const handleEditUser = (user) => {
   
    navigate(`/users/edit`, { state: { user } })
  }
  
  const handlePageChange = (newPage) => {
    setPage(newPage)
  }
  async function fetchusers(){
    let usersData=await getUsers(page,limit,roleFilter);
    let roles= await getRoles();
    setrolesData(roles)
    setUsers(usersData)
  }


  useEffect(()=>{
   fetchusers()
  },[])
  
  // Filter users by search term
  const filteredUsers = searchTerm
    ? users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users
  console.log(filteredUsers)
  const getRoleName = (roleId) => {
    const role = rolesData.find(r => r.id === roleId)
    return role ? role.name : 'Unknown'
  }
  
  return (
    <div>
      <PageHeader>
        <Title>User Management</Title>
        <Button onClick={handleCreateUser}>
          <FiPlus size={18} />
          Add User
        </Button>
      </PageHeader>
      
      <FiltersContainer>
        <FilterGroup>
          <Input
            id="search"
            label="Search"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<FiSearch />}
          />
        </FilterGroup>
        
        <FilterGroup>
          <Select
            id="role"
            label="Role"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(Number(e.target.value))
              setPage(1) // Reset to first page when filter changes
            }}
            options={roleOptions}
          />
        </FilterGroup>
      </FiltersContainer>
      
      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <>
          <Table>
            <TableHead>
              <tr>
                <TableHeader>S.No</TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Role</TableHeader>
                <TableHeader>Reporting To</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </TableHead>
            <TableBody>
            {filteredUsers.map((user, index) => (
  <TableRow key={user.id}>
    <TableCell>{index + 1}</TableCell>
    <TableCell>{user.name}</TableCell>
    <TableCell>{user.email}</TableCell>
    <TableCell>{getRoleName(user?.role_id)}</TableCell>
    <TableCell>{user.reporting_name || '—'}</TableCell>
   
   
    <TableCell>
  <span 
    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
    onClick={() => handleToggleStatus(user.id, user.is_active)}
    title="Toggle Status"
  >
    <StatusIndicator active={user.is_active === 1} />
    {user.is_active === 1 ? 'Active' : 'Inactive'}
  </span>
</TableCell>

    <TableCell>
      <ActionButton 
        size="small" 
        variant="outline"
        onClick={() => handleEditUser(user)}
      >
        <FiEdit size={14} />
      </ActionButton>
      <ActionButton 
        size="small" 
        variant="danger"
        onClick={() => handleDeleteUser(user.id)}
      >
        <FiTrash2 size={14} />
        
      </ActionButton>
    </TableCell>
  </TableRow>
))}

            </TableBody>
          </Table>
          
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
        </>
      )}
    </div>
  )
}

export default UsersPage