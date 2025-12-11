import { ColumnDef } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type MasterContentRow = {
  url: string;
  postDate: string;
  client: string;
  platform: string;
  format: string;
  category: string;
  subCategory: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagement: number;
  status: string;
  processingStatus: string;
  lastUpdated: string;
  ideaConcept?: string;
  origin?: string;
  baseFormat?: string;
  reelStyle?: string;
};

export const masterContentColumns: ColumnDef<MasterContentRow>[] = [
  {
    accessorKey: "url",
    header: "Link",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={row.original.url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              {row.original.url.slice(0, 30)}...
            </a>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs break-all text-xs">
          <a
              href={row.original.url}
              target="_blank"
              rel="noreferrer"
              className="max-w-xs break-all text-xs hover:text-blue-600 hover:underline"
            >
              {row.original.url}
            </a>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  { accessorKey: "postDate", header: "Post Date" },
  { accessorKey: "client", header: "Client" },
  { accessorKey: "platform", header: "Platform" },
  { accessorKey: "format", header: "Format" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "subCategory", header: "Sub-Category" },
  { accessorKey: "views", header: "Views" },
  { accessorKey: "likes", header: "Likes" },
  { accessorKey: "comments", header: "Comments" },
  { accessorKey: "shares", header: "Shares" },
  {
    accessorKey: "engagement",
    header: "Engagement %",
    cell: ({ row }) => `${row.original.engagement.toFixed(2)}%`,
  },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "processingStatus", header: "Processing" },
  { accessorKey: "lastUpdated", header: "Last Updated" },
  { accessorKey: "ideaConcept", header: "Idea Concept" },
  { accessorKey: "origin", header: "Origin" },
  { accessorKey: "baseFormat", header: "Base Format" },
  { accessorKey: "reelStyle", header: "Reel Style" },
];

