import {
	Document,
	Image,
	Page,
	StyleSheet,
	Text,
	View,
} from "@react-pdf/renderer";

// ─────────────────────────────────────────────
// DESIGN TOKENS (Strictly 3 Core Colors + Text)
// ─────────────────────────────────────────────
const C = {
	red: "#c8102e", // Academy Red
	white: "#ffffff", // Pure White
	lightGrey: "#f4f5f7", // Content Background Grey
	textDark: "#111827", // High-contrast text
	textMuted: "#6b7280", // Secondary text
	border: "#e5e7eb", // Thin dividers
} as const;

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const S = StyleSheet.create({
	// ── Page ──────────────────────────────────
	page: {
		width: 612,
		height: 396,
		padding: 0,
		fontFamily: "Helvetica",
		fontSize: 9,
		backgroundColor: C.white,
	},
	root: {
		flex: 1,
		overflow: "hidden",
	},
	// ── Top accent bar (crisp white frame above the red header) ──
	topBar: {
		height: 4,
		backgroundColor: C.red,
	},

	// ── Header (Redesigned to Red Academy) ────
	header: {
		backgroundColor: C.red,
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingTop: 14,
		paddingBottom: 14,
		minHeight: 92,
	},
	hLeft: {
		flex: 1,
		justifyContent: "space-between",
		paddingRight: 20,
	},
	hInstitutionRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 4,
	},
	hLogoImg: {
		width: 36,
		height: 36,
		objectFit: "contain",
		marginRight: 8,
	},
	hInstitution: {
		fontSize: 16,
		fontFamily: "Helvetica-Bold",
		color: C.white,
		letterSpacing: 0.2,
	},
	hDot: {
		fontSize: 8,
		color: "rgba(255, 255, 255, 0.4)",
		marginHorizontal: 5,
	},
	hContact: {
		fontSize: 7.5,
		color: "rgba(255, 255, 255, 0.65)",
		letterSpacing: 0.2,
	},
	hStudentName: {
		fontSize: 20,
		fontFamily: "Helvetica-Bold",
		color: C.white,
		letterSpacing: 0.1,
		marginBottom: 4,
	},
	hMetaRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	hIdText: {
		fontSize: 8,
		fontFamily: "Helvetica-Bold",
		color: "rgba(255, 255, 255, 0.85)",
	},
	hMetaDot: {
		fontSize: 8,
		color: "rgba(255, 255, 255, 0.3)",
		marginHorizontal: 6,
	},
	hGroupPill: {
		paddingVertical: 2,
		paddingHorizontal: 6,
		borderRadius: 2,
		backgroundColor: "rgba(255, 255, 255, 0.15)",
		marginRight: 5,
		borderWidth: 0.5,
		borderColor: "rgba(255, 255, 255, 0.3)",
	},
	hGroupText: {
		fontSize: 7,
		fontFamily: "Helvetica-Bold",
		color: C.white,
		letterSpacing: 0.5,
	},
	hModePill: {
		paddingVertical: 2,
		paddingHorizontal: 6,
		borderRadius: 2,
		backgroundColor: "rgba(255, 255, 255, 0.22)",
		borderWidth: 0.5,
		borderColor: "rgba(255, 255, 255, 0.4)",
	},
	hModeText: {
		fontSize: 7,
		color: C.white,
		letterSpacing: 0.4,
	},

	// Header right
	hRight: {
		width: 145,
		justifyContent: "space-between",
		alignItems: "flex-end",
	},
	hReceiptLabel: {
		fontSize: 7,
		fontFamily: "Helvetica-Bold",
		color: "rgba(255, 255, 255, 0.7)",
		letterSpacing: 1.5,
	},
	hSerialWrap: {
		flexDirection: "row",
		alignItems: "baseline",
		marginTop: 2,
	},
	hSerialPrefix: {
		fontSize: 9,
		fontFamily: "Helvetica-Bold",
		color: "rgba(255, 255, 255, 0.6)",
		marginRight: 3,
	},
	hSerial: {
		fontSize: 20,
		fontFamily: "Helvetica-Bold",
		color: C.white,
		lineHeight: 1,
	},
	hDate: {
		fontSize: 7.5,
		color: "rgba(255, 255, 255, 0.7)",
		textAlign: "right",
	},
	hStatusPill: {
		paddingVertical: 3,
		paddingHorizontal: 10,
		borderRadius: 2,
		borderWidth: 1,
	},
	hStatusPaid: {
		backgroundColor: C.white,
		borderColor: C.white,
	},
	hStatusPending: {
		backgroundColor: "transparent",
		borderColor: C.white,
	},
	hStatusTextPaid: {
		fontSize: 7,
		fontFamily: "Helvetica-Bold",
		color: C.red,
		letterSpacing: 1,
	},
	hStatusTextPending: {
		fontSize: 7,
		fontFamily: "Helvetica-Bold",
		color: C.white,
		letterSpacing: 1,
	},

	// ── Info strip ────────────────────────────
	infoStrip: {
		backgroundColor: C.lightGrey,
		borderBottomWidth: 1,
		borderBottomColor: C.border,
		flexDirection: "row",
		paddingHorizontal: 20,
		paddingVertical: 8,
	},
	iCell: {
		flex: 1,
	},
	iCellBordered: {
		flex: 1,
		borderLeftWidth: 1,
		borderLeftColor: C.border,
		paddingLeft: 12,
	},
	iLabel: {
		fontSize: 6,
		fontFamily: "Helvetica-Bold",
		color: C.textMuted,
		letterSpacing: 0.8,
		marginBottom: 2,
	},
	iValue: {
		fontSize: 8.5,
		fontFamily: "Helvetica-Bold",
		color: C.textDark,
	},
	iValueLight: {
		fontSize: 8.5,
		color: C.textDark,
	},

	// ── Body ──────────────────────────────────
	body: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: C.lightGrey,
	},

	// Left pane
	lPane: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 12,
		paddingBottom: 8,
	},
	lPaneLabel: {
		fontSize: 6,
		fontFamily: "Helvetica-Bold",
		color: C.textMuted,
		letterSpacing: 1.2,
		marginBottom: 8,
		paddingBottom: 4,
		borderBottomWidth: 1,
		borderBottomColor: C.border,
	},

	// Subject row
	subRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 5,
		paddingVertical: 6,
		paddingHorizontal: 10,
		backgroundColor: C.white,
		borderRadius: 2,
		borderLeftWidth: 3,
		borderLeftStyle: "solid",
		borderLeftColor: C.red,
	},
	subName: {
		flex: 1,
		fontSize: 9,
		fontFamily: "Helvetica-Bold",
		color: C.textDark,
	},
	subMeta: {
		alignItems: "flex-end",
	},
	subFee: {
		fontSize: 8,
		fontFamily: "Helvetica-Bold",
		color: C.textDark,
	},
	subTiming: {
		fontSize: 6.5,
		color: C.textMuted,
		marginTop: 1,
	},
	subTimingNone: {
		fontSize: 6.5,
		color: C.textMuted,
		marginTop: 1,
		fontStyle: "italic",
	},
	noSubjects: {
		fontSize: 8.5,
		color: C.textMuted,
		fontStyle: "italic",
	},

	// Photo Wrap
	photoWrap: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 10,
	},
	photoBox: {
		width: 46,
		height: 46,
		borderWidth: 1,
		borderColor: C.border,
		backgroundColor: C.white,
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
	},
	photoImg: {
		width: 46,
		height: 46,
		objectFit: "cover",
	},

	// Right pane
	rPane: {
		width: 190,
		borderLeftWidth: 1,
		borderLeftColor: C.border,
		backgroundColor: C.white,
		paddingHorizontal: 16,
		paddingTop: 12,
		paddingBottom: 12,
		justifyContent: "space-between",
	},

	// Balance hero
	balanceSection: {
		marginBottom: 10,
		paddingBottom: 8,
		borderBottomWidth: 1,
		borderBottomColor: C.border,
	},
	balanceLabel: {
		fontSize: 6,
		fontFamily: "Helvetica-Bold",
		color: C.textMuted,
		letterSpacing: 1.2,
		marginBottom: 3,
	},
	balanceRow: {
		flexDirection: "row",
		alignItems: "baseline",
	},
	balanceCurrency: {
		fontSize: 10,
		fontFamily: "Helvetica-Bold",
		color: C.textMuted,
		marginRight: 3,
	},
	balanceAmount: {
		fontSize: 24,
		fontFamily: "Helvetica-Bold",
		lineHeight: 1,
	},
	balanceDue: { color: C.red },
	balanceClear: { color: C.textDark },
	balanceNote: {
		fontSize: 7,
		color: C.textMuted,
		marginTop: 4,
	},

	// Fee breakdown
	feeSection: {
		flex: 1,
		marginBottom: 8,
	},
	feeSectionLabel: {
		fontSize: 6,
		fontFamily: "Helvetica-Bold",
		color: C.textMuted,
		letterSpacing: 1.0,
		marginBottom: 6,
	},
	feeRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 4,
		borderBottomWidth: 0.5,
		borderBottomColor: C.border,
	},
	feeRowLast: {
		borderBottomWidth: 0,
	},
	feeKey: {
		fontSize: 8,
		color: C.textMuted,
	},
	feeVal: {
		fontSize: 8,
		fontFamily: "Helvetica-Bold",
		color: C.textDark,
	},
	feeValRed: {
		color: C.red,
	},

	// Signature
	sigSection: {
		paddingTop: 8,
		borderTopWidth: 1,
		borderTopColor: C.border,
	},
	sigLine: {
		borderBottomWidth: 1,
		borderBottomColor: C.textDark,
		marginBottom: 4,
		width: 110,
	},
	sigLabel: {
		fontSize: 6,
		fontFamily: "Helvetica-Bold",
		color: C.textMuted,
		letterSpacing: 0.5,
	},

	// ── Admitted by strip ─────────────────────
	admittedByStrip: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingVertical: 3,
		borderTopWidth: 1,
		borderTopColor: C.border,
		backgroundColor: C.lightGrey,
	},
	admittedByLabel: {
		fontSize: 6,
		fontFamily: "Helvetica-Bold",
		color: C.textMuted,
		letterSpacing: 0.8,
	},
	admittedByValue: {
		fontSize: 7,
		fontFamily: "Helvetica-Bold",
		color: C.textDark,
	},

	// ── Version strip ─────────────────────────
	versionStrip: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingVertical: 4,
		borderTopWidth: 1,
		borderTopColor: C.border,
		backgroundColor: C.white,
	},
	versionTag: {
		fontSize: 7,
		fontFamily: "Helvetica-Bold",
		letterSpacing: 0.8,
	},
	versionTagOriginal: { color: C.textDark },
	versionTagDuplicate: { color: C.red },
	versionMeta: {
		fontSize: 6.5,
		color: C.textMuted,
	},

	// ── Footer ────────────────────────────────
	footer: {
		height: 36,
		backgroundColor: C.white,
		borderTopWidth: 1,
		borderTopColor: C.border,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 20,
	},
	fLeft: {
		flexDirection: "row",
		alignItems: "center",
	},
	fRedDot: {
		width: 4,
		height: 4,
		borderRadius: 2,
		backgroundColor: C.red,
		marginRight: 5,
	},
	fWarning: {
		fontSize: 7.5,
		fontFamily: "Helvetica-Bold",
		color: C.red,
	},
	fSep: {
		fontSize: 7.5,
		color: C.border,
		marginHorizontal: 5,
	},
	fNote: {
		fontSize: 7,
		color: C.textMuted,
		fontStyle: "italic",
	},
	fRight: {
		alignItems: "flex-end",
	},
	fAddress: {
		fontSize: 6.5,
		color: C.textDark,
		fontFamily: "Helvetica-Bold",
		textAlign: "right",
	},
	fSocial: {
		fontSize: 6,
		color: C.textMuted,
		textAlign: "right",
		marginTop: 1,
	},

	// ── Watermarks ────────────────────────────
	wmGIA: {
		position: "absolute",
		top: "35%",
		left: "25%",
		fontSize: 88,
		fontFamily: "Helvetica-Bold",
		color: "rgba(200, 16, 46, 0.02)",
		letterSpacing: 14,
		transform: "rotate(-24deg)",
	},
	wmDuplicate: {
		position: "absolute",
		top: "42%",
		left: "12%",
		fontSize: 52,
		fontFamily: "Helvetica-Bold",
		color: "rgba(200, 16, 46, 0.04)",
		letterSpacing: 8,
		transform: "rotate(-24deg)",
	},
});

// ─────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────
export interface StudentPDFData {
	_id?: string;
	studentId: string;
	studentName: string;
	fatherName: string;
	class: string;
	group: string;
	mode?: string;
	parentCell?: string;
	studentCell?: string;
	totalFee: number;
	sessionRate?: number;
	paidAmount: number;
	discountAmount?: number;
	feeStatus: string;
	admissionDate?: string | Date;
	subjects?: Array<{
		name: string;
		fee: number;
		timings?: Array<{ day: string; startTime: string; endTime: string }>;
	}>;
	photo?: string | null;
	admittedBy?: {
		fullName?: string;
		username?: string;
		role?: string;
	} | null;
}

export interface ReceiptPDFConfig {
	receiptId: string;
	version: number;
	isOriginal: boolean;
	printedAt: Date | string;
}

interface ReceiptPDFProps {
	student: StudentPDFData;
	receiptConfig: ReceiptPDFConfig;
	logoDataUrl?: string;
	studentPhotoDataUrl?: string;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const fmt = {
	date(d: Date | string | undefined): string {
		if (!d) return "—";
		try {
			const parsed = new Date(d);
			if (isNaN(parsed.getTime())) return "—";
			return parsed.toLocaleDateString("en-GB", {
				day: "2-digit",
				month: "short",
				year: "numeric",
			});
		} catch {
			return "—";
		}
	},
	dateWithTime(d: Date | string | undefined): string {
		if (!d) return "—";
		try {
			const parsed = new Date(d);
			if (isNaN(parsed.getTime())) return "—";
			return parsed.toLocaleDateString("en-GB", {
				day: "2-digit",
				month: "short",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			});
		} catch {
			return "—";
		}
	},
	currency(n: number): string {
		return `PKR ${(n || 0).toLocaleString()}`;
	},
	phone(p: string | undefined): string {
		if (!p) return "—";
		const d = p.replace(/\D/g, "");
		return d.length >= 10 ? `${d.slice(0, 4)}-${d.slice(4)}` : p;
	},
	className(c: string | undefined): string {
		return c ? c.replace(/-/g, " ").replace(/\s+/g, " ").trim() : "—";
	},
	timing(
		timings?: Array<{ day: string; startTime: string; endTime: string }>,
	): string | null {
		if (!timings?.length) return null;
		return timings
			.map((t) => `${t.day.slice(0, 3)}  ${t.startTime}–${t.endTime}`)
			.join("   ·   ");
	},
};

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
export const ReceiptPDF = ({
	student,
	receiptConfig,
	logoDataUrl,
	studentPhotoDataUrl,
}: ReceiptPDFProps) => {
	const balance = Math.max(
		0,
		(student.totalFee || 0) - (student.paidAmount || 0),
	);
	const isPaid = student.feeStatus === "paid" || balance === 0;
	const mode = student.mode ?? "Online";

	return (
		<Document>
			<Page size={[612, 396]} style={S.page}>
				<View style={S.root}>
					{/* ════ TOP RED BAR ════ */}
					<View style={S.topBar} />

					{/* ════ HEADER ════ */}
					<View style={S.header}>
						<View style={S.hLeft}>
							<View style={S.hInstitutionRow}>
								{logoDataUrl ? (
									<Image src={logoDataUrl} style={S.hLogoImg} />
								) : (
									<Image src="/logo.png" style={S.hLogoImg} />
								)}
								<Text style={S.hInstitution}>GENIUS ISLAMIAN'S ACADEMY</Text>
								<Text style={S.hDot}>·</Text>
								<Text style={S.hContact}>091-3067016 · 0333-9365145</Text>
							</View>

							<Text style={S.hStudentName}>{student.studentName}</Text>

							<View style={S.hMetaRow}>
								<Text style={S.hIdText}>ID: {student.studentId}</Text>
								<Text style={S.hMetaDot}>·</Text>
								<View style={S.hGroupPill}>
									<Text style={S.hGroupText}>{student.group || "General"}</Text>
								</View>
								<View style={S.hModePill}>
									<Text style={S.hModeText}>{mode}</Text>
								</View>
							</View>
						</View>

						<View style={S.hRight}>
							<Text style={S.hReceiptLabel}>ADMISSION RECEIPT</Text>

							<View style={S.hSerialWrap}>
								<Text style={S.hSerialPrefix}>S.No.</Text>
								<Text style={S.hSerial}>{student.studentId}</Text>
							</View>

							<Text style={S.hDate}>{fmt.date(receiptConfig.printedAt)}</Text>

							<View
								style={[
									S.hStatusPill,
									isPaid ? S.hStatusPaid : S.hStatusPending,
								]}
							>
								<Text style={isPaid ? S.hStatusTextPaid : S.hStatusTextPending}>
									{isPaid ? "PAID" : "PENDING"}
								</Text>
							</View>
						</View>
					</View>

					{/* ════ INFO STRIP ════ */}
					<View style={S.infoStrip}>
						<View style={S.iCell}>
							<Text style={S.iLabel}>FATHER</Text>
							<Text style={S.iValue}>{student.fatherName || "—"}</Text>
						</View>
						<View style={S.iCellBordered}>
							<Text style={S.iLabel}>CLASS</Text>
							<Text style={S.iValueLight}>{fmt.className(student.class)}</Text>
						</View>
						<View style={S.iCellBordered}>
							<Text style={S.iLabel}>CONTACT</Text>
							<Text style={S.iValueLight}>
								{fmt.phone(student.parentCell ?? student.studentCell)}
							</Text>
						</View>
						<View style={S.iCellBordered}>
							<Text style={S.iLabel}>ADMITTED</Text>
							<Text style={S.iValueLight}>
								{fmt.date(student.admissionDate)}
							</Text>
						</View>
						<View style={S.iCellBordered}>
							<Text style={S.iLabel}>RECEIPT ID</Text>
							<Text
								style={[
									S.iValueLight,
									{ fontSize: 7, fontFamily: "Helvetica-Bold" },
								]}
							>
								{receiptConfig.receiptId}
							</Text>
						</View>
					</View>

					{/* ════ BODY ════ */}
					<View style={S.body}>
						{/* ── Left pane — subjects ── */}
						<View style={S.lPane}>
							<Text style={S.lPaneLabel}>ENROLLMENT</Text>

							{studentPhotoDataUrl && (
								<View style={S.photoWrap}>
									<View style={S.photoBox}>
										<Image src={studentPhotoDataUrl} style={S.photoImg} />
									</View>
								</View>
							)}

							{student.subjects && student.subjects.length > 0 ? (
								student.subjects.map((sub, i) => {
									const timing = fmt.timing(sub.timings);
									return (
										<View key={i} style={S.subRow}>
											<Text style={S.subName}>{sub.name}</Text>
											<View style={S.subMeta}>
												{sub.fee > 0 && (
													<Text style={S.subFee}>{fmt.currency(sub.fee)}</Text>
												)}
												{timing ? (
													<Text style={S.subTiming}>{timing}</Text>
												) : (
													<Text style={S.subTimingNone}>Timing: not set</Text>
												)}
											</View>
										</View>
									);
								})
							) : (
								<Text style={S.noSubjects}>No subjects enrolled yet.</Text>
							)}
						</View>

						{/* ── Right pane — fee summary ── */}
						<View style={S.rPane}>
							<View style={S.balanceSection}>
								<Text style={S.balanceLabel}>BALANCE DUE</Text>
								<View style={S.balanceRow}>
									<Text style={S.balanceCurrency}>PKR</Text>
									<Text
										style={[
											S.balanceAmount,
											balance > 0 ? S.balanceDue : S.balanceClear,
										]}
									>
										{(balance || 0).toLocaleString()}
									</Text>
								</View>
								<Text style={S.balanceNote}>
									{isPaid ? "✓ Account settled" : "• Payment required"}
								</Text>
							</View>

							<View style={S.feeSection}>
								<Text style={S.feeSectionLabel}>FEE SUMMARY</Text>

								{student.sessionRate && student.sessionRate > 0 && (
									<View style={S.feeRow}>
										<Text style={S.feeKey}>Session Rate</Text>
										<Text style={S.feeVal}>
											{fmt.currency(student.sessionRate)}
										</Text>
									</View>
								)}

								{!!student.discountAmount && student.discountAmount > 0 && (
									<View style={S.feeRow}>
										<Text style={S.feeKey}>Discount</Text>
										<Text style={[S.feeVal, S.feeValRed]}>
											−{fmt.currency(student.discountAmount)}
										</Text>
									</View>
								)}

								<View style={S.feeRow}>
									<Text style={S.feeKey}>
										{student.sessionRate ? "Net Payable" : "Total Fee"}
									</Text>
									<Text style={S.feeVal}>{fmt.currency(student.totalFee)}</Text>
								</View>

								<View style={[S.feeRow, S.feeRowLast]}>
									<Text style={S.feeKey}>Paid</Text>
									<Text style={S.feeVal}>
										{fmt.currency(student.paidAmount)}
									</Text>
								</View>
							</View>

							<View style={S.sigSection}>
								<View style={S.sigLine} />
								<Text style={S.sigLabel}>AUTHORIZED SIGNATURE</Text>
							</View>
						</View>
					</View>

					{/* ════ ADMITTED BY STRIP ════ */}
					{student.admittedBy?.fullName && (
						<View style={S.admittedByStrip}>
							<Text style={S.admittedByLabel}>ADMITTED BY</Text>
							<Text style={S.admittedByValue}>
								{student.admittedBy.fullName}
								{student.admittedBy.role && ` • ${student.admittedBy.role}`}
							</Text>
						</View>
					)}

					{/* ════ VERSION STRIP ════ */}
					<View style={S.versionStrip}>
						<Text
							style={[
								S.versionTag,
								receiptConfig.isOriginal
									? S.versionTagOriginal
									: S.versionTagDuplicate,
							]}
						>
							{receiptConfig.isOriginal
								? "● ORIGINAL COPY"
								: `● DUPLICATE — COPY #${receiptConfig.version}`}
						</Text>
						<Text style={S.versionMeta}>
							Printed: {fmt.date(receiptConfig.printedAt)}
						</Text>
					</View>

					{/* ════ FOOTER ════ */}
					<View style={S.footer}>
						<View style={S.fLeft}>
							<View style={S.fRedDot} />
							<Text style={S.fWarning}>Fee is non-refundable</Text>
							<Text style={S.fSep}>·</Text>
							<Text style={S.fNote}>Not valid for legal purposes</Text>
						</View>
						<View style={S.fRight}>
							<Text style={S.fAddress}>
								Opp. Islamia College Gate No. 2, University Road, Peshawar
							</Text>
							<Text style={S.fSocial}>GIA — GENIUS ISLAMIAN'S ACADEMY</Text>
						</View>
					</View>

					{/* ════ WATERMARKS ════ */}
					<Text style={S.wmGIA}>GIA</Text>
					{!receiptConfig.isOriginal && (
						<Text style={S.wmDuplicate}>DUPLICATE</Text>
					)}
				</View>
			</Page>
		</Document>
	);
};

export default ReceiptPDF;
