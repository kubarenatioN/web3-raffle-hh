// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title PaginationLib
 * @notice Library for pagination utilities - works with any data type
 * @dev Deploy once, use across multiple contracts. Functions are internal for gas efficiency.
 */
library PaginationLib {
    error PaginationLib__InvalidPageSize();
    error PaginationLib__PageNumberOutOfRange();

    struct PageMetadata {
        uint256 currentPage;
        uint256 pageSize;
        uint256 totalItems;
        uint256 totalPages;
        bool hasNextPage;
        bool hasPreviousPage;
    }

    /**
     * @notice Calculate pagination metadata
     * @param totalItems Total number of items
     * @param page Page number (0-indexed)
     * @param pageSize Number of items per page
     * @return metadata Pagination metadata
     */
    function calculatePageMetadata(
        uint256 totalItems,
        uint256 page,
        uint256 pageSize
    ) internal pure returns (PageMetadata memory metadata) {
        if (pageSize == 0) {
            revert PaginationLib__InvalidPageSize();
        }

        uint256 totalPages = (totalItems + pageSize - 1) / pageSize;

        if (totalPages > 0) {
            if (page >= totalPages) {
                revert PaginationLib__PageNumberOutOfRange();
            }
        }

        return
            PageMetadata({
                currentPage: page,
                pageSize: pageSize,
                totalItems: totalItems,
                totalPages: totalPages,
                hasNextPage: totalPages > 0 && page < totalPages - 1,
                hasPreviousPage: page > 0
            });
    }

    /**
     * @notice Get start and end indices for a page
     * @param page Page number (0-indexed)
     * @param pageSize Number of items per page
     * @param totalItems Total number of items
     * @return startIndex Starting index (inclusive)
     * @return endIndex Ending index (exclusive)
     */
    function getPageIndices(
        uint256 page,
        uint256 pageSize,
        uint256 totalItems
    ) internal pure returns (uint256 startIndex, uint256 endIndex) {
        startIndex = page * pageSize;
        endIndex = startIndex + pageSize;
        if (endIndex > totalItems) {
            endIndex = totalItems;
        }
    }
}
