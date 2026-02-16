export interface ODIAnalytics {
  // Basic session info
  sessionId: string;
  userId?: string;
  timestamp: number;
  deviceType: "mobile" | "tablet" | "desktop";

  // Overview analytics
  overviewAnalytics: {
    [overviewId: string]: {
      type: string; // 'list', 'grid', 'map', etc.
      views: number;
      averageTimeSpent: number; // milliseconds
      itemsViewed: number;
      itemClickRate: number; // percentage of items clicked
      attributesEngagement: {
        [attributeId: string]: {
          visibilityRate: number; // how often this attribute is shown
          interactionRate: number; // how often users interact with this attribute
        }
      }
    }
  };

  // Detail view analytics
  detailViewAnalytics: {
    [detailViewId: string]: {
      type: string; // 'basic', 'thesaurus', etc.
      openCount: number;
      averageTimeSpent: number; // milliseconds
      openedFrom: {
        [attributeOrRoleId: string]: number // count of times opened from this attribute/role
      };
      openedBy: {
        click: number;
        hover: number;
      };
      attributesEngagement: {
        [attributeId: string]: {
          visibilityRate: number;
          interactionRate: number;
        }
      }
    }
  };

  // Item view analytics
  itemViewAnalytics: {
    [itemViewType: string]: { // 'profile', 'pin', etc.
      usageCount: number;
      clickThroughRate: number;
      attributeVisibility: {
        [attributeId: string]: number // percentage of time this attribute is shown
      }
    }
  };

  // Data binding analytics
  dataBindingAnalytics: {
    [bindingId: string]: {
      itemsLoaded: number;
      attributesUsed: {
        [attributeId: string]: {
          displayCount: number;
          interactionCount: number;
        }
      };
      transformsApplied: {
        map: number;
        filter: number;
        slice: number;
      }
    }
  };

  // View layout analytics
  layoutAnalytics: {
    [viewId: string]: {
      visibilityTime: number; // milliseconds
      resizeCount: number;
      preferredSize?: { width: number; height: number };
    }
  };

  // Malleability analytics (if enabled)
  malleabilityAnalytics?: {
    contentCustomizations: {
      [attributeId: string]: {
        toggleCount: number;
        visibilityChanges: number;
      }
    };
    compositionCustomizations: {
      addedViews: number;
      removedViews: number;
      reorderedViews: number;
    };
    layoutCustomizations: {
      layoutChanges: number;
      preferredLayouts: {
        [layoutType: string]: number // count of usage
      }
    }
  };

  // Navigation patterns
  navigationPatterns: {
    entryPoints: { [viewId: string]: number };
    exitPoints: { [viewId: string]: number };
    transitions: {
      [fromViewId: string]: {
        [toViewId: string]: number // count of transitions
      }
    }
  };
}