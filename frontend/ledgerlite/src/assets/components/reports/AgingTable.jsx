import React from "react";

export default function AgingTable({ title, data }) {
    // data: array of { entity, reference, date, amount, days, bucket }

    // Group by Bucket
    const buckets = ["Current", "1-30 Days", "31-60 Days", "61-90 Days", "> 90 Days"];
    const grouped = buckets.reduce((acc, bucket) => {
        acc[bucket] = data.filter(d => d.bucket === bucket);
        return acc;
    }, {});

    const formatCurrency = (val) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden animate-in fade-in duration-500">
            <div className="bg-marine-50/50 px-6 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-marine-800 text-lg">{title}</h3>
                <p className="text-sm text-gray-500">Unpaid invoices based on due date</p>
            </div>

            <div className="p-6 overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="border-b-2 border-marine-100">
                            <th className="py-3 px-4 font-semibold text-marine-900">Aging Period</th>
                            <th className="py-3 px-4 font-semibold text-marine-900">Customer/Vendor</th>
                            <th className="py-3 px-4 font-semibold text-marine-900">Reference</th>
                            <th className="py-3 px-4 font-semibold text-marine-900 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {buckets.map(bucket => {
                            const items = grouped[bucket];
                            if (items.length === 0) return null;

                            return (
                                <React.Fragment key={bucket}>
                                    {items.map((item, idx) => (
                                        <tr key={`${bucket}-${idx}`} className="hover:bg-gray-50/50 transition-colors">
                                            {idx === 0 && (
                                                <td
                                                    className="py-3 px-4 font-bold text-marine-700 align-top bg-gray-50/30"
                                                    rowSpan={items.length}
                                                >
                                                    {bucket}
                                                </td>
                                            )}
                                            <td className="py-3 px-4 text-gray-700">{item.entity}</td>
                                            <td className="py-3 px-4 text-gray-500 font-mono text-xs">{item.reference}</td>
                                            <td className="py-3 px-4 text-right font-medium text-gray-900">
                                                {formatCurrency(item.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-50/50 font-medium">
                                        <td colSpan="3" className="py-2 px-4 text-right text-gray-500 text-xs uppercase tracking-wide">
                                            Total {bucket}
                                        </td>
                                        <td className="py-2 px-4 text-right text-marine-700">
                                            {formatCurrency(items.reduce((sum, i) => sum + i.amount, 0))}
                                        </td>
                                    </tr>
                                </React.Fragment>
                            );
                        })}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan="4" className="py-8 text-center text-gray-400 italic">
                                    No outstanding items found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
