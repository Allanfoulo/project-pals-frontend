
import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, addDays } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Users, Clock } from "lucide-react";

// Mock calendar events
const mockEvents = [
  {
    id: "e1",
    title: "Team Meeting",
    date: addDays(new Date(), 1),
    time: "10:00 AM - 11:00 AM",
    attendees: ["John Doe", "Jane Smith", "Mike Johnson"],
    project: "Website Redesign",
  },
  {
    id: "e2",
    title: "Client Presentation",
    date: addDays(new Date(), 2),
    time: "2:00 PM - 3:30 PM",
    attendees: ["John Doe", "Jane Smith", "Client Team"],
    project: "Marketing Campaign",
  },
  {
    id: "e3",
    title: "Sprint Planning",
    date: addDays(new Date(), 3),
    time: "9:00 AM - 10:30 AM",
    attendees: ["Development Team"],
    project: "Mobile App Development",
  },
  {
    id: "e4",
    title: "Design Review",
    date: addDays(new Date(), 5),
    time: "11:00 AM - 12:00 PM",
    attendees: ["Design Team", "Product Manager"],
    project: "Website Redesign",
  },
];

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");

  // Filter events for the selected date
  const selectedDateEvents = date 
    ? mockEvents.filter(event => 
        event.date.getDate() === date.getDate() && 
        event.date.getMonth() === date.getMonth() && 
        event.date.getFullYear() === date.getFullYear()
      )
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <Tabs defaultValue="month" className="w-[300px]">
          <TabsList>
            <TabsTrigger value="month" onClick={() => setView("month")}>Month</TabsTrigger>
            <TabsTrigger value="week" onClick={() => setView("week")}>Week</TabsTrigger>
            <TabsTrigger value="day" onClick={() => setView("day")}>Day</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {date ? format(date, "EEEE, MMMM d, yyyy") : "No date selected"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 border rounded-lg hover:bg-secondary transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-lg">{event.title}</h3>
                      <Badge variant="outline">{event.project}</Badge>
                    </div>
                    <div className="mt-2 flex flex-col space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="mr-2 h-4 w-4" />
                        {event.attendees.join(", ")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                <CalendarClock className="h-12 w-12 mb-4" />
                <p>No events scheduled for this day</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;
