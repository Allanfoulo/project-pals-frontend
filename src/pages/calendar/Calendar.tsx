
import { useState, useEffect } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
// Tabs removed to fix rendering issues
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns/format";
import { addDays } from "date-fns/addDays";
import { startOfWeek } from "date-fns/startOfWeek";
import { endOfWeek } from "date-fns/endOfWeek";
import { eachDayOfInterval } from "date-fns/eachDayOfInterval";
import { isSameDay } from "date-fns/isSameDay";
import { startOfDay } from "date-fns/startOfDay";
import { endOfDay } from "date-fns/endOfDay";
import { addWeeks } from "date-fns/addWeeks";
import { subWeeks } from "date-fns/subWeeks";
import { addMonths } from "date-fns/addMonths";
import { subMonths } from "date-fns/subMonths";
import { getDay } from "date-fns/getDay";
import { getHours } from "date-fns/getHours";
import { getMinutes } from "date-fns/getMinutes";
import { setHours } from "date-fns/setHours";
import { setMinutes } from "date-fns/setMinutes";
import { parseISO } from "date-fns/parseISO";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Users, Clock, ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Event type definition
interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  attendees: string[];
  project: string;
  location?: string;
  color?: string;
}

// Mock calendar events
const mockEvents: CalendarEvent[] = [
  {
    id: "e1",
    title: "Team Meeting",
    description: "Weekly team sync to discuss project progress",
    startDate: setHours(setMinutes(addDays(new Date(), 1), 0), 10),
    endDate: setHours(setMinutes(addDays(new Date(), 1), 0), 11),
    attendees: ["John Doe", "Jane Smith", "Mike Johnson"],
    project: "Website Redesign",
    location: "Conference Room A",
    color: "#4f46e5"
  },
  {
    id: "e2",
    title: "Client Presentation",
    description: "Present the new marketing strategy to the client",
    startDate: setHours(setMinutes(addDays(new Date(), 2), 0), 14),
    endDate: setHours(setMinutes(addDays(new Date(), 2), 30), 15),
    attendees: ["John Doe", "Jane Smith", "Client Team"],
    project: "Marketing Campaign",
    location: "Main Conference Room",
    color: "#0ea5e9"
  },
  {
    id: "e3",
    title: "Sprint Planning",
    description: "Plan the next sprint tasks and priorities",
    startDate: setHours(setMinutes(addDays(new Date(), 3), 0), 9),
    endDate: setHours(setMinutes(addDays(new Date(), 3), 30), 10),
    attendees: ["Development Team"],
    project: "Mobile App Development",
    location: "Dev Room",
    color: "#10b981"
  },
  {
    id: "e4",
    title: "Design Review",
    description: "Review the latest UI designs for the website",
    startDate: setHours(setMinutes(addDays(new Date(), 5), 0), 11),
    endDate: setHours(setMinutes(addDays(new Date(), 5), 0), 12),
    attendees: ["Design Team", "Product Manager"],
    project: "Website Redesign",
    location: "Design Studio",
    color: "#f59e0b"
  },
  {
    id: "e5",
    title: "Product Demo",
    description: "Demonstrate the new features to stakeholders",
    startDate: setHours(setMinutes(addDays(new Date(), 2), 0), 11),
    endDate: setHours(setMinutes(addDays(new Date(), 2), 0), 12),
    attendees: ["Product Team", "Stakeholders"],
    project: "Mobile App Development",
    location: "Demo Room",
    color: "#8b5cf6"
  },
  {
    id: "e6",
    title: "Code Review",
    description: "Review pull requests and discuss code quality",
    startDate: setHours(setMinutes(addDays(new Date(), 4), 0), 15),
    endDate: setHours(setMinutes(addDays(new Date(), 4), 0), 16),
    attendees: ["Development Team"],
    project: "Website Redesign",
    location: "Virtual Meeting",
    color: "#ec4899"
  }
];

const Calendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    attendees: [],
    project: "",
    location: "",
    color: "#4f46e5"
  });
  const [attendeeInput, setAttendeeInput] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // Handle navigation between weeks/months/days
  const navigatePrevious = () => {
    if (view === "month") {
      setDate(subMonths(date, 1));
    } else if (view === "week") {
      setDate(subWeeks(date, 1));
    } else if (view === "day") {
      setDate(addDays(date, -1));
    }
  };
  
  const navigateNext = () => {
    if (view === "month") {
      setDate(addMonths(date, 1));
    } else if (view === "week") {
      setDate(addWeeks(date, 1));
    } else if (view === "day") {
      setDate(addDays(date, 1));
    }
  };
  
  const navigateToday = () => {
    setDate(new Date());
  };
  
  // Get events for different views
  const getEventsForDate = (day: Date) => {
    return events.filter(event => 
      isSameDay(event.startDate, day)
    );
  };
  
  const getEventsForWeek = () => {
    const start = startOfWeek(date, { weekStartsOn: 0 });
    const end = endOfWeek(date, { weekStartsOn: 0 });
    return events.filter(event => 
      (event.startDate >= start && event.startDate <= end)
    );
  };
  
  const getDaysOfWeek = () => {
    const start = startOfWeek(date, { weekStartsOn: 0 });
    const end = endOfWeek(date, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  };
  
  // Handle event creation
  const handleCreateEvent = () => {
    if (!newEvent.title) {
      toast({
        title: "Event title required",
        description: "Please enter a title for your event",
        variant: "destructive",
      });
      return;
    }
    
    if (!newEvent.project) {
      toast({
        title: "Project required",
        description: "Please select a project for your event",
        variant: "destructive",
      });
      return;
    }
    
    const createdEvent: CalendarEvent = {
      id: uuidv4(),
      title: newEvent.title || "",
      description: newEvent.description,
      startDate: newEvent.startDate || new Date(),
      endDate: newEvent.endDate || new Date(),
      attendees: newEvent.attendees || [],
      project: newEvent.project || "",
      location: newEvent.location,
      color: newEvent.color || "#4f46e5"
    };
    
    setEvents([...events, createdEvent]);
    setIsCreateEventOpen(false);
    
    // Reset form
    setNewEvent({
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      attendees: [],
      project: "",
      location: "",
      color: "#4f46e5"
    });
    setAttendeeInput("");
    
    toast({
      title: "Event created",
      description: `${createdEvent.title} has been added to your calendar`,
    });
  };
  
  const addAttendee = () => {
    if (attendeeInput.trim() && !newEvent.attendees?.includes(attendeeInput.trim())) {
      setNewEvent({
        ...newEvent,
        attendees: [...(newEvent.attendees || []), attendeeInput.trim()]
      });
      setAttendeeInput("");
    }
  };
  
  const removeAttendee = (attendee: string) => {
    setNewEvent({
      ...newEvent,
      attendees: newEvent.attendees?.filter(a => a !== attendee)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={navigatePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={navigateToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {view === 'month' && format(date, 'MMMM yyyy')}
          {view === 'week' && `Week of ${format(startOfWeek(date), 'MMM d')} - ${format(endOfWeek(date), 'MMM d, yyyy')}`}
          {view === 'day' && format(date, 'MMMM d, yyyy')}
        </h2>

        <div className="flex space-x-2">
          <div className="border rounded-md p-1 flex space-x-1">
            <Button
              variant={view === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('month')}
              className="text-xs"
            >
              Month
            </Button>
            <Button
              variant={view === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('week')}
              className="text-xs"
            >
              Week
            </Button>
            <Button
              variant={view === 'day' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('day')}
              className="text-xs"
            >
              Day
            </Button>
          </div>

          <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="eventTitle">Event Title</Label>
                  <Input
                    id="eventTitle"
                    value={newEvent.title || ""}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Enter event title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="eventDescription">Description</Label>
                  <Textarea
                    id="eventDescription"
                    value={newEvent.description || ""}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Enter event description"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date & Time</Label>
                    <div className="flex flex-col space-y-2">
                      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal",
                              !newEvent.startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newEvent.startDate ? format(newEvent.startDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={newEvent.startDate}
                            onSelect={(date) => {
                              if (date) {
                                const hours = newEvent.startDate ? getHours(newEvent.startDate) : 9;
                                const minutes = newEvent.startDate ? getMinutes(newEvent.startDate) : 0;
                                const newStartDate = setHours(setMinutes(date, minutes), hours);
                                setNewEvent({ ...newEvent, startDate: newStartDate });
                                
                                // Also update end date if not set or if before start date
                                if (!newEvent.endDate || newEvent.endDate < newStartDate) {
                                  const newEndDate = setHours(setMinutes(date, minutes), hours + 1);
                                  setNewEvent(prev => ({ ...prev, endDate: newEndDate }));
                                }
                              }
                              setCalendarOpen(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      
                      <div className="flex space-x-2">
                        <Select
                          value={newEvent.startDate ? getHours(newEvent.startDate).toString() : "9"}
                          onValueChange={(value) => {
                            if (newEvent.startDate) {
                              const newDate = setHours(newEvent.startDate, parseInt(value));
                              setNewEvent({ ...newEvent, startDate: newDate });
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Hour" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => (
                              <SelectItem key={i} value={i.toString()}>
                                {i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Select
                          value={newEvent.startDate ? (getMinutes(newEvent.startDate) === 0 ? "0" : "30") : "0"}
                          onValueChange={(value) => {
                            if (newEvent.startDate) {
                              const newDate = setMinutes(newEvent.startDate, parseInt(value));
                              setNewEvent({ ...newEvent, startDate: newDate });
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Minute" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">00</SelectItem>
                            <SelectItem value="30">30</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>End Date & Time</Label>
                    <div className="flex flex-col space-y-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal",
                              !newEvent.endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newEvent.endDate ? format(newEvent.endDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={newEvent.endDate}
                            onSelect={(date) => {
                              if (date) {
                                const hours = newEvent.endDate ? getHours(newEvent.endDate) : 10;
                                const minutes = newEvent.endDate ? getMinutes(newEvent.endDate) : 0;
                                setNewEvent({ ...newEvent, endDate: setHours(setMinutes(date, minutes), hours) });
                              }
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      
                      <div className="flex space-x-2">
                        <Select
                          value={newEvent.endDate ? getHours(newEvent.endDate).toString() : "10"}
                          onValueChange={(value) => {
                            if (newEvent.endDate) {
                              const newDate = setHours(newEvent.endDate, parseInt(value));
                              setNewEvent({ ...newEvent, endDate: newDate });
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Hour" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => (
                              <SelectItem key={i} value={i.toString()}>
                                {i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Select
                          value={newEvent.endDate ? (getMinutes(newEvent.endDate) === 0 ? "0" : "30") : "0"}
                          onValueChange={(value) => {
                            if (newEvent.endDate) {
                              const newDate = setMinutes(newEvent.endDate, parseInt(value));
                              setNewEvent({ ...newEvent, endDate: newDate });
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Minute" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">00</SelectItem>
                            <SelectItem value="30">30</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="eventProject">Project</Label>
                  <Select
                    value={newEvent.project}
                    onValueChange={(value) => setNewEvent({ ...newEvent, project: value })}
                  >
                    <SelectTrigger id="eventProject">
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Website Redesign">Website Redesign</SelectItem>
                      <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
                      <SelectItem value="Marketing Campaign">Marketing Campaign</SelectItem>
                      <SelectItem value="Content Strategy">Content Strategy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="eventLocation">Location</Label>
                  <Input
                    id="eventLocation"
                    value={newEvent.location || ""}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder="Enter event location"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="eventColor">Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      id="eventColor"
                      value={newEvent.color || "#4f46e5"}
                      onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
                      className="w-12 h-8 p-1"
                    />
                    <div 
                      className="w-8 h-8 rounded-full border"
                      style={{ backgroundColor: newEvent.color || "#4f46e5" }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Attendees</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={attendeeInput}
                      onChange={(e) => setAttendeeInput(e.target.value)}
                      placeholder="Add attendee"
                      onKeyDown={(e) => e.key === "Enter" && addAttendee()}
                    />
                    <Button type="button" variant="outline" onClick={addAttendee}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newEvent.attendees?.map((attendee) => (
                      <Badge key={attendee} variant="secondary" className="px-2 py-1">
                        {attendee}
                        <button
                          className="ml-1 text-muted-foreground hover:text-foreground"
                          onClick={() => removeAttendee(attendee)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateEventOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateEvent}>
                  Create Event
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {view === 'month' && (
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-7 gap-px bg-muted">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-px bg-muted">
              {Array.from({ length: 35 }, (_, i) => {
                const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
                const dayOffset = getDay(firstDayOfMonth);
                const day = new Date(date.getFullYear(), date.getMonth(), i - dayOffset + 1);
                const isCurrentMonth = day.getMonth() === date.getMonth();
                const isToday = isSameDay(day, new Date());
                const dayEvents = getEventsForDate(day);

                return (
                  <div
                    key={i}
                    className={cn(
                      'min-h-[100px] p-2 bg-background transition-colors',
                      !isCurrentMonth && 'text-muted-foreground bg-muted/30',
                      isToday && 'border-2 border-primary',
                      isSameDay(day, date) && 'bg-muted/50'
                    )}
                    onClick={() => setDate(day)}
                  >
                    <div className="font-medium text-sm mb-1">{format(day, 'd')}</div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className="text-xs truncate rounded px-1 py-0.5"
                          style={{ backgroundColor: `${event.color}20`, color: event.color }}
                        >
                          {format(event.startDate, 'h:mm a')} {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {view === 'week' && (
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-7 gap-px bg-muted">
              {getDaysOfWeek().map((day) => (
                <div
                  key={day.toISOString()}
                  className={cn(
                    'p-2 text-center',
                    isSameDay(day, new Date()) && 'bg-muted/50 font-bold'
                  )}
                >
                  <div className="text-sm font-medium">{format(day, 'EEE')}</div>
                  <div className="text-lg">{format(day, 'd')}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-px bg-muted">
              {getDaysOfWeek().map((day) => {
                const dayEvents = getEventsForDate(day);

                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      'min-h-[300px] p-2 bg-background',
                      isSameDay(day, new Date()) && 'bg-muted/20'
                    )}
                    onClick={() => {
                      setDate(day);
                      setView('day');
                    }}
                  >
                    <div className="space-y-1">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className="text-sm p-2 mb-1 rounded truncate"
                          style={{ backgroundColor: `${event.color}20`, color: event.color, borderLeft: `3px solid ${event.color}` }}
                        >
                          <div className="font-medium">{event.title}</div>
                          <div className="text-xs">
                            {format(event.startDate, 'h:mm a')} - {format(event.endDate, 'h:mm a')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {view === 'day' && (
        <div className="mt-4">
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
                  {format(date, 'EEEE, MMMM d, yyyy')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getEventsForDate(date).length > 0 ? (
                  <div className="space-y-4">
                    {getEventsForDate(date).map((event) => (
                      <div
                        key={event.id}
                        className="p-4 border rounded-lg hover:bg-secondary transition-colors"
                        style={{ borderLeft: `4px solid ${event.color}` }}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-lg">{event.title}</h3>
                          <Badge variant="outline">{event.project}</Badge>
                        </div>
                        {event.description && (
                          <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                        )}
                        <div className="mt-2 flex flex-col space-y-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-2 h-4 w-4" />
                            {format(event.startDate, 'h:mm a')} - {format(event.endDate, 'h:mm a')}
                          </div>
                          {event.location && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {event.location}
                            </div>
                          )}
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="mr-2 h-4 w-4" />
                            {event.attendees.join(', ')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                    <CalendarClock className="h-12 w-12 mb-4" />
                    <p>No events scheduled for this day</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setNewEvent({
                          ...newEvent,
                          startDate: setHours(setMinutes(date, 0), 9),
                          endDate: setHours(setMinutes(date, 0), 10),
                        });
                        setIsCreateEventOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Event
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
