import React, { useEffect, useState } from "react";
import "./Metrics.css"; // Importing CSS
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

function Metrics() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);
  const [totalFabricDefects, setTotalFabricDefects] = useState(0);
  const [defectsVerified, setDefectsVerified] = useState(0); // New state for defects verified

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await fetch("http://localhost:5001/total-users");
        if (!response.ok) {
          throw new Error("Failed to fetch total users");
        }
        const data = await response.json();
        setTotalUsers(data.totalUsers);
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };

    const fetchTotalAbsent = async () => {
      try {
        const response = await fetch("http://localhost:5001/total-absent");
        if (!response.ok) {
          throw new Error("Failed to fetch total absent employees");
        }
        const data = await response.json();
        setTotalAbsent(data.totalAbsent);
      } catch (error) {
        console.error("Error fetching total absent employees:", error);
      }
    };

    const fetchTotalFabricDefects = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/total-fabric-defects"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch fabric defects count");
        }
        const data = await response.json();
        setTotalFabricDefects(data.totalFabricDefects);
      } catch (error) {
        console.error("Error fetching fabric defects count:", error);
      }
    };

    // Fetch defects verified from the backend
    const fetchDefectsVerified = async () => {
      try {
        const response = await fetch("http://localhost:5001/defects-verified");
        if (!response.ok) {
          throw new Error("Failed to fetch defects verified count");
        }
        const data = await response.json();
        setDefectsVerified(data.defectsVerified);
      } catch (error) {
        console.error("Error fetching defects verified count:", error);
      }
    };

    fetchTotalUsers();
    fetchTotalAbsent();
    fetchTotalFabricDefects();
    fetchDefectsVerified(); // Fetch defects verified count
  }, []);

  return (
    <div className="w-full flex items-center justify-between gap-5 mx-auto">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="">Total Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">{totalUsers}</div>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="">Absent Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">{totalAbsent}</div>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="">Fabric Defects Detected</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">
            {totalFabricDefects}
          </div>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="">Defects Verified</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">{defectsVerified}</div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Metrics;
