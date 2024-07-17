import moment from "moment";
import { PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useSettings } from "context/settings";
import { DAYS_OF_WEEK, DEFAULT_TIME_FORMAT } from "lib/constants";
import { classNames, generateTimeStringSlots } from "lib/utils";
import { TfmFormSelect } from "@/components/ui/forms";

const timeOptions = generateTimeStringSlots(
  moment("05:00", DEFAULT_TIME_FORMAT),
  moment("24:00", DEFAULT_TIME_FORMAT)
);

const ActionButton = ({ trash = false, onClick }) => (
  <button
    className={classNames(
      "justify-center rounded p-2 text-sm font-medium text-gray-900 transition-colors",
      trash
        ? "hover:border-red-100 hover:bg-red-100 hover:text-red-700 focus-visible:border-red-100 focus-visible:bg-red-100 focus-visible:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700"
        : "hover:border-red-100 hover:bg-green-100 hover:text-green-700 focus-visible:border-green-100 focus-visible:bg-green-100 focus-visible:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700"
    )}
    tabIndex={-1}
    onClick={onClick}
  >
    {trash ? (
      <TrashIcon className="h-4 w-4" />
    ) : (
      <PlusIcon className="h-4 w-4" />
    )}
    <span className="sr-only">{trash ? "Delete hours" : "Add hours"}</span>
  </button>
);

function getTimeOptionLabel(time) {
  return moment(time, DEFAULT_TIME_FORMAT).format("h:mm A");
}

export default function WorkingHours() {
  const {
    workingHours,
    setDayAsAvailable,
    setDayAsUnavailable,
    updateEndTime,
    updateStartTime,
    addWorkingHours,
    removeWorkingHours,
  } = useSettings();

  return (
    <div className="space-y-4 divide-y pb-4">
      {DAYS_OF_WEEK.map((day) => {
        const { available, hours } = workingHours[day];

        return (
          <div key={day} className="flex items-center space-x-4 pt-4">
            <input
              type="checkbox"
              id={`available_${day}`}
              onChange={(e) => {
                if (e.target.checked) setDayAsAvailable(day);
                else setDayAsUnavailable(day);
              }}
              className="h-4 w-4 rounded border-gray-300 text-tfm-primary focus:ring-tfm-primary"
              checked={available}
            />
            <label
              htmlFor={`available_${day}`}
              className="block w-24 font-medium leading-5 text-gray-700"
            >
              {day}
            </label>
            <div className="grid space-y-2">
              {available &&
                hours.map(({ start, end }, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center space-x-4"
                  >
                    <TfmFormSelect
                      id={`start_${day}`}
                      value={start}
                      onChange={(e) =>
                        updateStartTime(day, index, e.target.value)
                      }
                    >
                      {timeOptions.map((time) => (
                        <option key={time} value={time} disabled={time >= end}>
                          {getTimeOptionLabel(time)}
                        </option>
                      ))}
                    </TfmFormSelect>
                    <span className="text-sm text-gray-500">to</span>
                    <TfmFormSelect
                      id={`end_${day}`}
                      value={end}
                      onChange={(e) =>
                        updateEndTime(day, index, e.target.value)
                      }
                    >
                      {timeOptions.map((time) => (
                        <option
                          key={time}
                          value={time}
                          disabled={time <= start}
                        >
                          {getTimeOptionLabel(time)}
                        </option>
                      ))}
                    </TfmFormSelect>
                    {index === 0 ? (
                      <ActionButton onClick={() => addWorkingHours(day)} />
                    ) : (
                      <ActionButton
                        trash
                        onClick={() => removeWorkingHours(day, index)}
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
