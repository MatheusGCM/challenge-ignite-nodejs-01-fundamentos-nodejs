import fs from 'fs/promises'

// Dados que você deseja escrever no arquivo CSV
const data = [
  { title: 'Task 01', description: 'Descrição da Task 01' },
  { title: 'Task 02', description: 'Descrição da Task 02' },
  { title: 'Task 03', description: 'Descrição da Task 03' },
  { title: 'Task 04', description: 'Descrição da Task 04' },
  { title: 'Task 05', description: 'Descrição da Task 05' },
]

// Função para converter um objeto em uma linha CSV
function convertToCSV(obj) {
  const values = Object.values(obj)
  return values.map((value) => `"${value}"`).join(',') + '\n'
}

// Converter os dados para linhas CSV
const csvData = data.map(convertToCSV).join('')

// Caminho do arquivo CSV
const filePath = 'output.csv'

// Escrever os dados no arquivo CSV
fs.writeFile(filePath, 'title,description\n' + csvData)

console.log(`Arquivo CSV criado em: ${filePath}`)
