"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, FileImage, ExternalLink } from "lucide-react";
import type { Message } from "@/actions/messageActions";

interface MessageTableProps {
  data: Message[];
}

export function MessageTable({ data }: MessageTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(data.map(m => m.category));
    return Array.from(cats).sort();
  }, [data]);

  // Filter messages
  const filteredMessages = useMemo(() => {
    return data.filter((msg) => {
      const messageText = msg.raw_text || msg.message || "";
      const matchesSearch =
        messageText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.group_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (msg.sender_username && msg.sender_username.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = categoryFilter === "all" || msg.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [data, searchTerm, categoryFilter]);

  // Paginate
  const totalPages = Math.ceil(filteredMessages.length / pageSize);
  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages, sender, group..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Sender</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="text-center">Type</TableHead>
              <TableHead className="text-center">AI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMessages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No messages found
                </TableCell>
              </TableRow>
            ) : (
              paginatedMessages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(message.date).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="font-medium max-w-[150px] truncate">
                    {message.group_name}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {message.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{message.sender_name}</span>
                      {message.sender_username && (
                        <a
                          href={message.sender_link || `https://t.me/${message.sender_username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                          @{message.sender_username}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="line-clamp-2">{message.raw_text || message.message || "[No text]"}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    {message.message_type === "media" ? (
                      <div className="flex items-center justify-center gap-1">
                        <FileImage className="h-4 w-4 text-blue-600" />
                        <span className="text-xs text-muted-foreground">Media</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Text</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {message.is_ai_processed ? (
                      <span className="text-green-600 font-bold">✓</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {paginatedMessages.length} of {filteredMessages.length} messages
          {categoryFilter !== "all" && ` in ${categoryFilter}`}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
