import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { localDate } from "lib/date";
import { Pie } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

function getPercentageValue(value, total) {
  return Math.round((value / total) * 100);
}

export default function TimeWise({ family_member_name, time_wise }) {
  const totalHours =
    time_wise.family_hours +
    time_wise.sleep_hours +
    time_wise.career_hours +
    time_wise.personal_hours +
    time_wise.health_hours;

  const fields = {
    family_hours: {
      label: `Family (${getPercentageValue(
        time_wise.family_hours,
        totalHours
      )}%)`,
      color: "#002244",
      value: time_wise.family_hours,
    },
    sleep_hours: {
      label: `Sleep (${getPercentageValue(
        time_wise.sleep_hours,
        totalHours
      )}%)`,
      color: "#EFE9CE",
      value: time_wise.sleep_hours,
    },
    career_hours: {
      label: `Career (${getPercentageValue(
        time_wise.career_hours,
        totalHours
      )}%)`,
      color: "#BF6547",
      value: time_wise.career_hours,
    },
    personal_hours: {
      label: `Personal (${getPercentageValue(
        time_wise.personal_hours,
        totalHours
      )}%)`,
      color: "#DDA15E",
      value: time_wise.personal_hours,
    },
    health_hours: {
      label: `Health (${getPercentageValue(
        time_wise.health_hours,
        totalHours
      )}%)`,
      color: "#F1DCA7",
      value: time_wise.health_hours,
    },
  };
  const data = {
    labels: Object.keys(fields).map((field) => fields[field].label),
    datasets: [
      {
        label: " Hours per week",
        data: Object.keys(fields).map((field) => fields[field].value),
        backgroundColor: Object.keys(fields).map(
          (field) => fields[field].color
        ),
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        labels: {
          padding: 24,
          font: {
            size: 14,
            family: "Montserrat, sans-serif",
          },
        },
      },
    },
  };
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center space-y-4">
      <h3 className="font-brand text-lg font-semibold leading-6 text-gray-800">
        {family_member_name}
        {"'"}s Weekly Schedule
      </h3>
      <p className="font-brand text-xs font-semibold uppercase tracking-wider text-gray-500">
        Last updated on {localDate(time_wise.completed_on)}
      </p>
      <Pie {...{ data, options }} />
    </div>
  );
}
