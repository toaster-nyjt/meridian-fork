import React from "react";
import { ViewOptions } from "../../spec/spec.internal";
import { useODI } from "../../store/odi.store";

export const OverviewCustom = (options: ViewOptions) => {
    const { customLayouts } = useODI();
    const { overview, items } = options;

    // Find the custom layout by the overview type
    const customLayout = customLayouts.find(layout => layout.id === overview.type);

    if (!customLayout) {
        return (
            <div style={{ padding: "24px", textAlign: "center", color: "#999" }}>
                <p>Custom layout "{overview.type}" not found.</p>
                <p style={{ fontSize: "12px", marginTop: "8px" }}>
                    Please check your custom layouts in Meridian UI Settings.
                </p>
            </div>
        );
    }

    // Try to execute the custom layout code
    try {
        // Create a function that returns the component
        // Note: This uses Function constructor which has security implications
        // In production, you might want to use a code sandbox or server-side rendering
        const CustomComponent = React.useMemo(() => {
            try {
                // Create a function that executes the code in a scope with React available
                const codeWithWrapper = `
          (function(React) {
            ${customLayout.code}
            return typeof CustomLayoutView !== 'undefined' ? CustomLayoutView : 
                   (typeof exports !== 'undefined' && exports.default) ? exports.default :
                   (typeof module !== 'undefined' && module.exports) ? module.exports :
                   null;
          })
        `;

                // Use Function constructor to create the component factory
                const ComponentFactory = new Function('React', `return ${codeWithWrapper}`)(React);
                const Component = ComponentFactory(React);

                if (!Component || typeof Component !== 'function') {
                    throw new Error("Component not found. Make sure your code defines a component named 'CustomLayoutView'.");
                }

                // Return a wrapper component that passes props correctly
                return (props: ViewOptions) => {
                    try {
                        return React.createElement(Component, props);
                    } catch (error) {
                        console.error("Error rendering custom component:", error);
                        return React.createElement('div', { style: { padding: '24px', color: '#c33' } },
                            'Error rendering custom layout: ' + (error instanceof Error ? error.message : 'Unknown error')
                        );
                    }
                };
            } catch (error) {
                console.error("Error loading custom layout:", error);
                return null;
            }
        }, [customLayout.code]);

        if (!CustomComponent) {
            throw new Error("Failed to load custom component");
        }

        return <CustomComponent {...options} />;
    } catch (error: any) {
        return (
            <div style={{ padding: "24px", background: "#fee", border: "1px solid #fcc", borderRadius: "8px", color: "#c33" }}>
                <p style={{ fontWeight: 600, marginBottom: "8px" }}>Error rendering custom layout:</p>
                <p style={{ fontSize: "14px", marginBottom: "12px" }}>{error?.message || "Unknown error"}</p>
                <p style={{ fontSize: "12px", color: "#999" }}>
                    Please check your custom layout code in Meridian UI Settings.
                </p>
            </div>
        );
    }
};

