import { employees } from './data/employees.ts'

const App = () => {
  return (
    <div>
      <h1>Employee Filter System</h1>
      <pre>{JSON.stringify(employees, null, 2)}</pre>
    </div>
  )
}

export default App