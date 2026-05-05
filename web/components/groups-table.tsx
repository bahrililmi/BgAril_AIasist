"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { updateGroupCategory, toggleGroupStatus, type GroupConfig } from "@/actions/groupActions";
import { Trash2 } from "lucide-react";

const CATEGORIES = [
  "ZONA_WARRIOR",
  "NEED_KANVAS",
  "H2H_SUPPLIER",
  "ROOFTOP",
  "RMW_INTERNAL",
  "UNMAPPED",
];

interface GroupsTableProps {
  initialGroups: GroupConfig[];
}

export function GroupsTable({ initialGroups }: GroupsTableProps) {
  const [groups, setGroups] = useState(initialGroups);
  const { toast } = useToast();

  const handleCategoryChange = async (groupId: string, newCategory: string) => {
    const result = await updateGroupCategory(groupId, newCategory);
    
    if (result.success) {
      setGroups(groups.map(g => 
        g.id === groupId ? { ...g, category: newCategory } : g
      ));
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update category",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (groupId: string, currentStatus: boolean) => {
    const result = await toggleGroupStatus(groupId, !currentStatus);
    
    if (result.success) {
      setGroups(groups.map(g => 
        g.id === groupId ? { ...g, is_active: !currentStatus } : g
      ));
      toast({
        title: "Success",
        description: `Group ${!currentStatus ? "activated" : "deactivated"}`,
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Group Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                No groups found. Groups will appear here automatically when the collector detects them.
              </TableCell>
            </TableRow>
          ) : (
            groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell className="font-medium">{group.group_name}</TableCell>
                <TableCell>
                  <Select
                    value={group.category}
                    onValueChange={(value) => handleCategoryChange(group.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      group.is_active
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {group.is_active ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(group.id, group.is_active)}
                  >
                    {group.is_active ? "Deactivate" : "Activate"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
