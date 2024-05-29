import React, { useState, useRef, useEffect } from "react";

const Screen = () => {
  const [time, setTime] = useState({ hours: "", minutes: "", seconds: "" });
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value.length <= 2 && /^[0-9]*$/.test(value)) {
      setTime((prevTime) => ({
        ...prevTime,
        [name]: value,
      }));
    }
  };

  const convertToSeconds = ({ hours, minutes, seconds }) => {
    return (
      parseInt(hours || 0, 10) * 3600 +
      parseInt(minutes || 0, 10) * 60 +
      parseInt(seconds || 0, 10)
    );
  };

  const startTimer = () => {
    if (!isRunning) {
      const totalSeconds = convertToSeconds(time);
      if (totalSeconds > 0) {
        setTimeLeft(totalSeconds);
        setIsRunning(true);
      }
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetTimer = () => {
    stopTimer();
    setTimeLeft(0);
    setTime({ hours: "", minutes: "", seconds: "" });
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      stopTimer();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return {
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    };
  };

  const displayTime = formatTime(timeLeft);

  return (
    <div className="container">
      <h1>Countdown Timer</h1>
      <div className="timer-labels">
        <p>Hours</p>
        <p className="colon">:</p>
        <p>Minutes</p>
        <p className="colon">:</p>
        <p>Seconds</p>
      </div>

      <div className="timer-inputs">
        <input
          // type="number"
          name="hours"
          value={time.hours}
          onChange={handleChange}
          className="input-time"
          placeholder="00"
          max={23}
        />
        <p className="colon">:</p>
        <input
          // type="number"
          name="minutes"
          value={time.minutes}
          onChange={handleChange}
          className="input-time"
          placeholder="00"
          max={59}
        />
        <p className="colon">:</p>
        <input
          // type="number"
          name="seconds"
          value={time.seconds}
          onChange={handleChange}
          className="input-time"
          placeholder="00"
          max={59}
        />
      </div>

      <div className="timer-display">
        <span>{displayTime.hours}</span>
        <p className="colon">:</p>
        <span>{displayTime.minutes}</span>
        <p className="colon">:</p>
        <span>{displayTime.seconds}</span>
      </div>
      <div className="container-btns">
        <button
          className="start"
          onClick={startTimer}
          style={{ display: isRunning ? "none" : "initial" }}
        >
          Start
        </button>
        <button
          className="stop"
          onClick={stopTimer}
          style={{ display: isRunning ? "initial" : "none" }}
        >
          Stop
        </button>
        <button className="reset" onClick={resetTimer}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default Screen;
