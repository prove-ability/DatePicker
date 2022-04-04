const NAME_OF_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export default function DatePicker({ $container, width }) {
  // css 주입
  const css = document.getElementById("date-picker-css")
  if (!css) {
    const head = document.getElementsByTagName("head")[0]
    const link = document.createElement("link")
    link.id = "date-picker-css"
    link.rel = "stylesheet"
    link.type = "text/css"
    link.href = "/components/DatePicker/style.css"
    head.appendChild(link)
  }

  this.$component = document.createElement("section")
  this.$component.className = "date-picker"
  this.$component.style.setProperty("--calendar-size", `${width}px`)

  this.$input = document.createElement("input")
  this.$input.className = "input"
  this.$input.placeholder = "Select date"
  this.$input.readOnly = true
  this.$component.appendChild(this.$input)

  this.$calendar = document.createElement("div")
  this.$calendar.className = "calendar"
  this.$calendar.innerHTML = `
    <div class="calendar-nav">
      <span class="prev-month-btn">◀</span>
      <span class="year-month"></span>
      <span class="next-month-btn">▶</span>
    </div> 
  `
  this.$component.appendChild(this.$calendar)

  this.$calendarGrid = document.createElement("div")
  this.$calendarGrid.className = "calendar-grid"
  this.$calendar.appendChild(this.$calendarGrid)

  this.clickInput = () => {
    this.$calendar.classList.add("view")
  }

  this.clickPrevMonth = () => {
    this.thisDay.setMonth(this.thisDay.getMonth() - 1)
    this.getCalendarHTML()
  }
  this.clickNextMonth = () => {
    this.thisDay.setMonth(this.thisDay.getMonth() + 1)
    this.getCalendarHTML()
  }

  const processDate = (day) => {
    const month = day.getMonth()
    const year = day.getFullYear()
    return {
      lastMonthLastDate: new Date(year, month, 0),
      thisMonthFirstDate: new Date(year, month, 1),
      thisMonthLastDate: new Date(year, month + 1, 0),
    }
  }

  this.thisDay = new Date()
  this.toMonth = this.thisDay.getMonth()
  this.toYear = this.thisDay.getFullYear()

  this.getCalendarHTML = () => {
    // 초기화
    this.$calendarGrid.innerHTML = ""

    let { lastMonthLastDate, thisMonthFirstDate, thisMonthLastDate } =
      processDate(this.thisDay)

    // 월별 이름 설정
    const $yearMonth = this.$calendar.querySelector(".year-month")
    $yearMonth.innerHTML = `
      <span>${NAME_OF_MONTHS[this.thisDay.getMonth()]}</span>
      <span>${this.thisDay.getFullYear()}</span>
    `

    // 요일 설정
    this.$calendarGrid.innerHTML = `
      <span class="day-of-the-week column-1 row-1">SUN</span>
      <span class="day-of-the-week column-2 row-1">MON</span>
      <span class="day-of-the-week column-3 row-1">TUE</span>
      <span class="day-of-the-week column-4 row-1">WED</span>
      <span class="day-of-the-week column-5 row-1">THU</span>
      <span class="day-of-the-week column-6 row-1">FRI</span>
      <span class="day-of-the-week column-7 row-1">SAT</span>
    `

    // 좌표
    let row = 2
    let column = 1

    // 지난 달
    for (let d = 0; d < thisMonthFirstDate.getDay(); d++) {
      const $span = document.createElement("span")
      $span.className = `day post-month column-${column++} row-${row}`
      $span.innerText = `${
        lastMonthLastDate.getDate() - thisMonthFirstDate.getDay() + d + 1
      }`
      $span.dataset.day =
        lastMonthLastDate.getDate() - thisMonthFirstDate.getDay() + d + 1
      this.$calendarGrid.appendChild($span)
      if (column === 8) {
        column = 1
        row++
      }
    }
    // 이번 달
    for (let d = 0; d < thisMonthLastDate.getDate(); d++) {
      const $span = document.createElement("span")
      $span.className = `day column-${column++} row-${row}`
      if (
        d + 1 === this.thisDay.getDate() &&
        this.toMonth === this.thisDay.getMonth() &&
        this.toYear === this.thisDay.getFullYear()
      )
        $span.classList.add("today")
      else if ((thisMonthFirstDate.getDay() + d) % 7 === 0)
        $span.classList.add("sun")
      $span.innerText = d + 1
      $span.dataset.day = d + 1
      this.$calendarGrid.appendChild($span)
      if (column === 8) {
        column = 1
        row++
      }
    }
    // 다음 달
    let nextMonthDaysToRender = 7 - (column % 7) + 1
    for (let d = 0; d < nextMonthDaysToRender; d++) {
      const $span = document.createElement("span")
      $span.className = `day next-month column-${column++} row-${row}`
      $span.innerText = d + 1
      $span.dataset.day = d + 1
      this.$calendarGrid.appendChild($span)
      if (column === 8) {
        column = 1
        row++
      }
    }

    let year = this.thisDay.getFullYear()
    this.$calendarGrid.querySelectorAll(".day").forEach(($day) => {
      $day.addEventListener("click", (e) => {
        const classList = e.target.classList

        let month = this.thisDay.getMonth() + 1
        if (classList.contains("post-month")) month -= 1
        else if (classList.contains("next-month")) month += 1
        if (month < 10) month = "0" + month

        let day = e.target.dataset.day
        if (day.length === 1) day = "0" + day

        this.$input.value = `${year}-${month}-${day}`
        this.$calendar.classList.remove("view")
      })
    })
  }

  this.render = () => {
    $container.appendChild(this.$component)
  }

  this.init = () => {
    this.getCalendarHTML()
    this.$input.addEventListener("click", this.clickInput)
    const $prevMonthButton = this.$calendar.querySelector(".prev-month-btn")
    const $nextMonthButton = this.$calendar.querySelector(".next-month-btn")
    $prevMonthButton.addEventListener("click", this.clickPrevMonth)
    $nextMonthButton.addEventListener("click", this.clickNextMonth)
  }

  document.addEventListener("DOMContentLoaded", () => {
    this.init()
  })

  // 외부 클릭시 닫기
  document.addEventListener("click", (e) => {
    if (
      this.$calendar.classList.contains("view") &&
      !e.target.closest(".date-picker")
    )
      this.$calendar.classList.remove("view")
  })
}
