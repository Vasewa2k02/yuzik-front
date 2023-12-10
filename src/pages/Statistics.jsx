import { useContext, useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Chart } from "primereact/chart";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";

//icons
import "primeicons/primeicons.css";

import { observer } from "mobx-react-lite";
import "../styles/statistics.css";

import * as statisticsApi from "../api-requests/statistics-api";

const Statistics = observer(() => {
  const [leaderboard, setLeaderboard] = useState(null);
  const [userAll, setUserAll] = useState({});
  const [userToday, setUserToday] = useState({});
  const [chartsOptions, setChartsOptions] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const allStatistics = await statisticsApi.getAllStatistics();
      const userAllStatistics = await statisticsApi.getUserAllStatistics();
      const userTodayStatistics = await statisticsApi.getUserTodayStatistics();

      const documentStyle = getComputedStyle(document.documentElement);

      const _userAll = {
        labels: ["слова", "задания", "квиз очки"],
        datasets: [
          {
            data: [
              userAllStatistics[0]?.words,
              userAllStatistics[0]?.tasks,
              userAllStatistics[0]?.quizpoints,
            ],
            backgroundColor: [
              documentStyle.getPropertyValue("--blue-500"),
              documentStyle.getPropertyValue("--yellow-500"),
              documentStyle.getPropertyValue("--green-500"),
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue("--blue-400"),
              documentStyle.getPropertyValue("--yellow-400"),
              documentStyle.getPropertyValue("--green-400"),
            ],
          },
        ],
      };

      const _userToday = {
        labels: ["слова", "задания", "квиз очки"],
        datasets: [
          {
            data: [
              userTodayStatistics?.words,
              userTodayStatistics?.tasks,
              userTodayStatistics?.quizPoints,
            ],
            backgroundColor: [
              documentStyle.getPropertyValue("--blue-500"),
              documentStyle.getPropertyValue("--yellow-500"),
              documentStyle.getPropertyValue("--green-500"),
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue("--blue-400"),
              documentStyle.getPropertyValue("--yellow-400"),
              documentStyle.getPropertyValue("--green-400"),
            ],
          },
        ],
      };

      const options = {
        cutout: "85%",
      };

      setLeaderboard(allStatistics);
      setUserAll(_userAll);
      setUserToday(_userToday);
      setChartsOptions(options);
    } catch (error) {}
  };

  const header = (
    <span className="text-xl text-900 font-bold">Статистика за всё время</span>
  );

  return (
    <div className="statistics-container">
      <div className="statistics-container__table">
        <DataTable
          header={header}
          className="card"
          value={leaderboard}
          editMode="row"
          dataKey="id"
          sortOrder={1}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 20, 50]}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          metaKeySelection={true}
        >
          <Column
            header="№"
            headerStyle={{ width: "3rem" }}
            body={(data, options) => options.rowIndex + 1}
          />
          <Column field="name" header="имя" sortable />
          <Column field="words" header="слов" sortable />
          <Column field="tasks" header="заданий" sortable />
          <Column field="quizpoints" header="квиз очков" sortable />
        </DataTable>
      </div>
      <div className=" flex justify-content-center">
        <h5>Личная статистика за всё время</h5>
        <Chart
          type="doughnut"
          data={userAll}
          options={chartsOptions}
          className="w-full md:w-30rem"
        />
      </div>
      <div className=" flex justify-content-center">
        <h5>Личная статистика за сегодня</h5>
        <Chart
          type="doughnut"
          data={userToday}
          options={chartsOptions}
          className="w-full md:w-30rem"
        />
      </div>
    </div>
  );
});

export default Statistics;
