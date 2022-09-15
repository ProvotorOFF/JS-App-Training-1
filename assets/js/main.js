class App {

    #appContainer = document.querySelector('#app')
    #inputForm = null
    #tableBody = null;
    #studentsData = []

    constructor() {
        this.#init()
    }

    #init() {
        this.#addStudentForm()
        this.#addFilterForm()
        this.#addTableTemplate()
    }

    #addStudentForm() {
        this.#inputForm = document.createElement('form')
        const button = document.createElement('button')
        const input = {
            name: document.createElement('input'),
            lastName: document.createElement('input'),
            fatherName: document.createElement('input'),
            birthDate: document.createElement('input'),
            admissionYear: document.createElement('input'),
            faculty: document.createElement('input'),
        }
        this.#inputForm.classList.add('app__student-form')
        input.name.type = 'text'
        input.name.placeholder = 'Имя студента'
        input.name.id = 'name'
        input.name.setAttribute('autocomplete', true)
        input.lastName.type = 'text'
        input.lastName.placeholder = 'Фамилия студента'
        input.lastName.id = 'lastName'
        input.lastName.setAttribute('autocomplete', true)
        input.fatherName.type = 'text'
        input.fatherName.placeholder = 'Отчество студента'
        input.fatherName.id = 'fatherName'
        input.fatherName.setAttribute('autocomplete', true)
        input.birthDate.type = 'date'
        input.birthDate.id = 'birthDate'
        input.birthDate.setAttribute('autocomplete', true)
        input.admissionYear.type = 'number'
        input.admissionYear.placeholder = 'Год поступления'
        input.admissionYear.id = 'admissionYear'
        input.faculty.type = 'text'
        input.faculty.placeholder = 'Факультет студента'
        input.faculty.id = 'faculty'
        button.innerText = 'Добавить студента'
        button.classList.add('student-form__submit')
        Object.values(input).forEach(item => {
            const row = document.createElement('div')
            const errorLabel = document.createElement('label')
            row.classList.add('student-form__row')
            errorLabel.classList.add('student-form__error')
            item.classList.add('student-form__input')
            row.append(item)
            row.append(errorLabel)
            this.#inputForm.append(row)
        })
        const row = document.createElement('div')
        row.classList.add('student-form__row')
        row.append(button)
        this.#inputForm.append(row)
        this.#appContainer.append(this.#inputForm)
        this.#addFormListiner(input)
    }

    #addFormListiner(input) {
        Object.values(input).forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('error')
                input.closest('div').querySelector('label').innerText = ''
            })
        })
        this.#inputForm.addEventListener('submit', (event) => {
            event.preventDefault()
            let data = {}
            let isError = false
            for (let [key, field] of Object.entries(input)) {
                const value = field.value.trim()
                data[key] = value
                if (!value) {
                    input[key].closest('div').querySelector('label').innerText = 'Поле обязательно к заполнению!'
                    input[key].classList.add('error')
                    isError = true
                }
            }
            if (isError) return
            for (let field of Object.values(input)) {
                field.value = ''
            }
            let status;
            if (+data.admissionYear + 4 < (new Date()).getFullYear() || (+data.admissionYear + 4 == (new Date()).getFullYear() && 8 >= (new Date()).getMonth())) {
                status = '(Закончил)'
            } else {
                status = `(${((new Date()).getFullYear() - (+data.admissionYear))} курс)`
            }
            const response = {
                name: `${data.lastName} ${data.name} ${data.fatherName}`,
                faculty: data.faculty,
                birthDate: `${data.birthDate.split('-').reverse().join('.')} (${Math.floor(Math.abs((new Date()).getTime() - (new Date(data.birthDate)).getTime()) / 1000 / 3600 / 24 / 365)} лет)`,
                studyYears: `${data.admissionYear}-${+data.admissionYear + 4} ${status}`,
                id: this.#studentsData.length
            }
            this.#addTableRow(response)
        })
    }

    #addFilterForm() {
        const searchField = document.createElement('div')
        const searchHeader = document.createElement('h3')
        const searchFieldContainer = document.createElement('div')
        const fields = {
            nameFilter: document.createElement('input'),
            faculty: document.createElement('input'),
            admissionYear: document.createElement('input'),
            endYear: document.createElement('input')
        }
        searchField.classList.add('app__filter-container')
        searchHeader.classList.add('filter-container__header')
        searchFieldContainer.classList.add('filter-container__body')
        searchHeader.innerText = 'Поиск по таблице'
        fields.nameFilter.placeholder = 'Фильтр по ФИО'
        fields.faculty.placeholder = 'Фильтр по факультету'
        fields.admissionYear.placeholder = 'Фильтр по году начала обучения'
        fields.endYear.placeholder = 'Фильтр по году конца обучения'
        Object.values(fields).forEach(input => {
            input.classList.add('filter-container__input')
            searchFieldContainer.append(input)
        })
        searchField.append(searchHeader)
        searchField.append(searchFieldContainer)
        this.#appContainer.append(searchField)
        this.#addFilterListener(fields)
    }

    #addTableTemplate() {
        const table = document.createElement('table')
        const tHead = document.createElement('thead')
        this.#tableBody = document.createElement('tbody')
        const headerRow = document.createElement('tr')
        const cols = {
            name: document.createElement('th'),
            faculty: document.createElement('th'),
            birthDate: document.createElement('th'),
            studyYears: document.createElement('th')
        }
        table.classList.add('app__student-table')
        tHead.classList.add('student-table__header')
        this.#tableBody.classList.add('student-table__body')
        headerRow.classList.add('student-table__header-row')
        cols.name.innerText = 'ФИО студента'
        cols.faculty.innerText = 'Факультет'
        cols.birthDate.innerText = 'Дата рождения (возраст)'
        cols.studyYears.innerText = 'Годы обучения'
        Object.values(cols).forEach(col => {
            col.classList.add('student-table__header-col')
            headerRow.append(col)
        })
        tHead.append(headerRow)
        table.append(tHead)
        table.append(this.#tableBody)
        this.#appContainer.append(table)
        this.#addTableHeaderListiner(cols)
    }

    #addTableRow(input, addStudent = true) {
        const row = document.createElement('tr')
        row.dataset.id = input.id
        const cols = {
            name: document.createElement('td'),
            faculty: document.createElement('td'),
            birthDate: document.createElement('td'),
            studyYears: document.createElement('td')
        }
        row.classList.add('student-table__row')
        for (let [name, col] of Object.entries(cols)) {
            col.classList.add('student-table__col', name)
            col.innerText = input[name]
            row.append(col)
        }
        this.#tableBody.append(row)
        if (addStudent) this.#studentsData.push(input)
    }

    #addTableHeaderListiner(cols) {
        for (let [colName, colValue] of Object.entries(cols)) {
            colValue.addEventListener('click', (event) => {
                Object.values(cols).forEach(col => col.classList.remove('active'))
                event.target.classList.add('active')
                this.#studentsData.sort((a, b) => {
                    switch (colName) {
                        case 'name':
                        case 'faculty':
                            return a[colName] > b[colName] ? 1 : -1
                        case 'birthDate':
                            return Number(a[colName].split(' ')[0].trim().split('.').reverse().join('')) - Number(b[colName].split(' ')[0].trim().split('.').reverse().join(''))
                    }
                    return a[colName].split('-')[0].trim() - b[colName].split('-')[0].trim()
                })
                this.#tableBodyRender()
            })
        }

    }

    #tableBodyRender() {
        this.#tableBody.innerHTML = ''
        for (const student of this.#studentsData) {
            this.#addTableRow(student, false)
        }
    }

    #addFilterListener(filters) {
        for (const value of Object.values(filters)) {
            value.addEventListener('input', () => {
                for (const student of this.#studentsData) {
                    const tableRow = document.querySelector(`.student-table__row[data-id="${student.id}"]`)
                    let filterCheck = true
                    for (const [name, value] of Object.entries(filters)) {
                        if (value.value) {
                            if (name == 'nameFilter' && !student.name.includes(value.value)) filterCheck = false
                            if (name == 'faculty' && !student.faculty.includes(value.value)) filterCheck = false
                            if (name == 'admissionYear' && value.value != student.studyYears.split(' ')[0].split('-')[0]) filterCheck = false
                            if (name == 'endYear' && value.value != student.studyYears.split(' ')[0].split('-')[1]) filterCheck = false
                        }
                    }
                    if (filterCheck) tableRow.classList.remove('hidden')
                    else tableRow.classList.add('hidden')
                }
            })
        }
    }
}