/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
declare module powerbi {
    enum VisualDataRoleKind {
        /** Indicates that the role should be bound to something that evaluates to a grouping of values. */
        Grouping = 0,
        /** Indicates that the role should be bound to something that evaluates to a single value in a scope. */
        Measure = 1,
        /** Indicates that the role can be bound to either Grouping or Measure. */
        GroupingOrMeasure = 2,
    }
    enum VisualDataChangeOperationKind {
        Create = 0,
        Append = 1,
    }
    enum VisualUpdateType {
        Data = 2,
        Resize = 4,
        ViewMode = 8,
        Style = 16,
        ResizeEnd = 32,
        All = 62,
    }
    enum VisualPermissions {
    }
    const enum CartesianRoleKind {
        X = 0,
        Y = 1,
    }
    const enum ViewMode {
        View = 0,
        Edit = 1,
        InFocusEdit = 2,
    }
    const enum ResizeMode {
        Resizing = 1,
        Resized = 2,
    }
    const enum JoinPredicateBehavior {
        /** Prevent items in this role from acting as join predicates. */
        None = 0,
    }
    const enum PromiseResultType {
        Success = 0,
        Failure = 1,
    }
    /**
     * Defines actions to be taken by the visual in response to a selection.
     *
     * An undefined/null VisualInteractivityAction should be treated as Selection,
     * as that is the default action.
     */
    const enum VisualInteractivityAction {
        /** Normal selection behavior which should call onSelect */
        Selection = 0,
        /** No additional action or feedback from the visual is needed */
        None = 1,
    }
}
???



declare module powerbi.visuals.plugins {
    /** This IVisualPlugin interface is only used by the CLI tools when compiling */
    export interface IVisualPlugin {
        /** The name of the plugin.  Must match the property name in powerbi.visuals. */
        name: string;

        /** Function to call to create the visual. */
        create: (options?: extensibility.VisualConstructorOptions) => extensibility.IVisual;

        /** The class of the plugin.  At the moment it is only used to have a way to indicate the class name that a custom visual has. */
        class: string;

        /** Check if a visual is custom */
        custom: boolean;

        /** The version of the api that this plugin should be run against */
        apiVersion: string;
        
        /** Human readable plugin name displayed to users */
        displayName: string;

    }
}
???



declare module jsCommon {
    export interface IStringResourceProvider {
        get(id: string): string;
        getOptional(id: string): string;
    }
}???



declare module powerbi {
    /** 
     * An interface to promise/deferred, 
     * which abstracts away the underlying mechanism (e.g., Angular, jQuery, etc.). 
     */
    export interface IPromiseFactory {
        /** 
         * Creates a Deferred object which represents a task which will finish in the future.
         */
        defer<T>(): IDeferred<T>;

        /** 
         * Creates a Deferred object which represents a task which will finish in the future.
         */
        defer<TSuccess, TError>(): IDeferred2<TSuccess, TError>;

        /**
         * Creates a promise that is resolved as rejected with the specified reason.
         * This api should be used to forward rejection in a chain of promises.
         * If you are dealing with the last promise in a promise chain, you don't need to worry about it.
         * When comparing deferreds/promises to the familiar behavior of try/catch/throw,
         * think of reject as the throw keyword in JavaScript.
         * This also means that if you "catch" an error via a promise error callback and you want 
         * to forward the error to the promise derived from the current promise, 
         * you have to "rethrow" the error by returning a rejection constructed via reject.
         * 
         * @param reason Constant, message, exception or an object representing the rejection reason.
         */
        reject<TError>(reason?: TError): IPromise2<any, TError>;

        /**
         * Creates a promise that is resolved with the specified value.
         * This api should be used to forward rejection in a chain of promises. 
         * If you are dealing with the last promise in a promise chain, you don't need to worry about it.
         *
         * @param value Object representing the promise result.
         */
        resolve<TSuccess>(value?: TSuccess): IPromise2<TSuccess, any>;

        /**
         * Combines multiple promises into a single promise that is resolved when all of the input promises are resolved.
         * Rejects immediately if any of the promises fail
         */
        all(promises: IPromise2<any, any>[]): IPromise<any[]>;
        
        /**
         * Combines multiple promises into a single promise that is resolved when all of the input promises are resolved.
         * Does not resolve until all promises finish (success or failure).
         */
        allSettled<T>(promises: IPromise2<any, any>[]): IPromise<IPromiseResult<T>[]>;        

        /**
         * Wraps an object that might be a value or a then-able promise into a promise. 
         * This is useful when you are dealing with an object that might or might not be a promise
         */
        when<T>(value: T | IPromise<T>): IPromise<T>;
    }

    /** 
     * Represents an operation, to be completed (resolve/rejected) in the future.
     */
    export interface IPromise<T> extends IPromise2<T, T> {
    }

    /**
     * Represents an operation, to be completed (resolve/rejected) in the future.
     * Success and failure types can be set independently.
     */
    export interface IPromise2<TSuccess, TError> {
        /**
         * Regardless of when the promise was or will be resolved or rejected, 
         * then calls one of the success or error callbacks asynchronously as soon as the result is available.
         * The callbacks are called with a single argument: the result or rejection reason.
         * Additionally, the notify callback may be called zero or more times to provide a progress indication, 
         * before the promise is resolved or rejected.
         * This method returns a new promise which is resolved or rejected via 
         * the return value of the successCallback, errorCallback.
         */
        then<TSuccessResult, TErrorResult>(successCallback: (promiseValue: TSuccess) => IPromise2<TSuccessResult, TErrorResult>, errorCallback?: (reason: TError) => TErrorResult): IPromise2<TSuccessResult, TErrorResult>;

        /**
         * Regardless of when the promise was or will be resolved or rejected,
         * then calls one of the success or error callbacks asynchronously as soon as the result is available.
         * The callbacks are called with a single argument: the result or rejection reason.
         * Additionally, the notify callback may be called zero or more times to provide a progress indication,
         * before the promise is resolved or rejected.
         * This method returns a new promise which is resolved or rejected via 
         * the return value of the successCallback, errorCallback.
         */
        then<TSuccessResult, TErrorResult>(successCallback: (promiseValue: TSuccess) => TSuccessResult, errorCallback?: (reason: TError) => TErrorResult): IPromise2<TSuccessResult, TErrorResult>;

        /**
         * Shorthand for promise.then(null, errorCallback).
         */
        catch<TErrorResult>(onRejected: (reason: any) => IPromise2<TSuccess, TErrorResult>): IPromise2<TSuccess, TErrorResult>;

        /**
         * Shorthand for promise.then(null, errorCallback).
         */
        catch<TErrorResult>(onRejected: (reason: any) => TErrorResult): IPromise2<TSuccess, TErrorResult>;

        /**
         * Allows you to observe either the fulfillment or rejection of a promise, 
         * but to do so without modifying the final value.
         * This is useful to release resources or do some clean-up that needs to be done 
         * whether the promise was rejected or resolved.
         * See the full specification for more information.
         * Because finally is a reserved word in JavaScript and reserved keywords 
         * are not supported as property names by ES3, you'll need to invoke 
         * the method like promise['finally'](callback) to make your code IE8 and Android 2.x compatible.
         */
        finally<T, U>(finallyCallback: () => any): IPromise2<T, U>;
    }

    export interface IDeferred<T> extends IDeferred2<T, T> {
    }

    export interface IDeferred2<TSuccess, TError> {
        resolve(value: TSuccess): void;
        reject(reason?: TError): void;
        promise: IPromise2<TSuccess, TError>;
    }

    export interface RejectablePromise2<T, E> extends IPromise2<T, E> {
        reject(reason?: E): void;
        resolved(): boolean;
        rejected(): boolean;
        pending(): boolean;
    }

    export interface RejectablePromise<T> extends RejectablePromise2<T, T> {
    }

    export interface IResultCallback<T> {
        (result: T, done: boolean): void;
    }
    
    export interface IPromiseResult<T> {
        type: PromiseResultType;
        value: T;
    }
}



declare module powerbi.visuals {
    import Selector = data.Selector;

    export interface ISelectionIdBuilder {
        withCategory(categoryColumn: DataViewCategoryColumn, index: number): this;
        withSeries(seriesColumn: DataViewValueColumns, valueColumn: DataViewValueColumn | DataViewValueColumnGroup): this;
        withMeasure(measureId: string): this;
        createSelectionId(): ISelectionId;
    }
    
    export interface ISelectionId {
        equals(other: ISelectionId): boolean;
        includes(other: ISelectionId, ignoreHighlight?: boolean): boolean;
        getKey(): string;
        getSelector(): Selector;
        getSelectorsByColumn(): Selector;
        hasIdentity(): boolean;
    }
}???



declare module powerbi {
    export const enum SortDirection {
        Ascending = 1,
        Descending = 2,
    }
}???



declare module powerbi {
    /** Represents views of a data set. */
    export interface DataView {
        metadata: DataViewMetadata;
        categorical?: DataViewCategorical;
        single?: DataViewSingle;
        tree?: DataViewTree;
        table?: DataViewTable;
        matrix?: DataViewMatrix;
        scriptResult?: DataViewScriptResultData;
    }

    export interface DataViewMetadata {
        columns: DataViewMetadataColumn[];

        /** The metadata repetition objects. */
        objects?: DataViewObjects;

        /** When defined, describes whether the DataView contains just a segment of the complete data set. */
        segment?: DataViewSegmentMetadata;
    }

    export interface DataViewMetadataColumn {
        /** The user-facing display name of the column. */
        displayName: string;

        /** The query name the source column in the query. */
        queryName?: string;

        /** The format string of the column. */
        format?: string; // TODO: Deprecate this, and populate format string through objects instead.

        /** Data type information for the column. */
        type?: ValueTypeDescriptor;

        /** Indicates that this column is a measure (aggregate) value. */
        isMeasure?: boolean;

        /** The position of the column in the select statement. */
        index?: number;

        /** The properties that this column provides to the visualization. */
        roles?: { [name: string]: boolean };

        /** The metadata repetition objects. */
        objects?: DataViewObjects;

        /** The name of the containing group. */
        groupName?: PrimitiveValue;

        /** The sort direction of this column. */
        sort?: SortDirection;

        /** The KPI metadata to use to convert a numeric status value into its visual representation. */
        kpi?: DataViewKpiColumnMetadata;

        /** Indicates that aggregates should not be computed across groups with different values of this column. */
        discourageAggregationAcrossGroups?: boolean;

        /** The aggregates computed for this column, if any. */
        aggregates?: DataViewColumnAggregates;

        /** The SQExpr this column represents. */
        expr?: data.ISQExpr;
    }

    export interface DataViewSegmentMetadata {
    }

    export interface DataViewColumnAggregates {
        subtotal?: PrimitiveValue;
        max?: PrimitiveValue;
        min?: PrimitiveValue;
        average?: PrimitiveValue;
        median?: PrimitiveValue;
        count?: number;
        percentiles?: DataViewColumnPercentileAggregate[];

        /** Client-computed maximum value for a column. */
        maxLocal?: PrimitiveValue;

        /** Client-computed maximum value for a column. */
        minLocal?: PrimitiveValue;
    }

    export interface DataViewColumnPercentileAggregate {
        exclusive?: boolean;
        k: number;
        value: PrimitiveValue;
    }

    export interface DataViewCategorical {
        categories?: DataViewCategoryColumn[];
        values?: DataViewValueColumns;
    }

    export interface DataViewCategoricalColumn {
        source: DataViewMetadataColumn;
        values: PrimitiveValue[];

        /** The data repetition objects. */
        objects?: DataViewObjects[];
    }

    export interface DataViewValueColumns extends Array<DataViewValueColumn> {
        /** Returns an array that groups the columns in this group together. */
        grouped(): DataViewValueColumnGroup[];

        /** The set of expressions that define the identity for instances of the value group.  This must match items in the DataViewScopeIdentity in the grouped items result. */
        identityFields?: data.ISQExpr[];

        source?: DataViewMetadataColumn;
    }

    export interface DataViewValueColumnGroup {
        values: DataViewValueColumn[];
        identity?: DataViewScopeIdentity;

        /** The data repetition objects. */
        objects?: DataViewObjects;

        name?: PrimitiveValue;
    }

    export interface DataViewValueColumn extends DataViewCategoricalColumn {
        highlights?: PrimitiveValue[];
        identity?: DataViewScopeIdentity;
    }

    // NOTE: The following is needed for backwards compatibility and should be deprecated.  Callers should use
    // DataViewMetadataColumn.aggregates instead.
    export interface DataViewValueColumn extends DataViewColumnAggregates {
    }

    export interface DataViewCategoryColumn extends DataViewCategoricalColumn {
        identity?: DataViewScopeIdentity[];

        /** The set of expressions that define the identity for instances of the category.  This must match items in the DataViewScopeIdentity in the identity. */
        identityFields?: data.ISQExpr[];
    }

    export interface DataViewSingle {
        value: PrimitiveValue;
    }

    export interface DataViewTree {
        root: DataViewTreeNode;
    }

    export interface DataViewTreeNode {
        name?: PrimitiveValue;

        /**
         * When used under the context of DataView.tree, this value is one of the elements in the values property.
         *
         * When used under the context of DataView.matrix, this property is the value of the particular 
         * group instance represented by this node (e.g. In a grouping on Year, a node can have value == 2016).
         *
         * DEPRECATED for usage under the context of DataView.matrix: This property is deprecated for objects 
         * that conform to the DataViewMatrixNode interface (which extends DataViewTreeNode).
         * New visuals code should consume the new property levelValues on DataViewMatrixNode instead.
         * If this node represents a composite group node in matrix, this property will be undefined.
         */
        value?: PrimitiveValue;
      
        /** 
         * This property contains all the values in this node. 
         * The key of each of the key-value-pair in this dictionary is the position of the column in the 
         * select statement to which the value belongs.
         */
        values?: { [id: number]: DataViewTreeNodeValue };

        children?: DataViewTreeNode[];
        identity?: DataViewScopeIdentity;

        /** The data repetition objects. */
        objects?: DataViewObjects;

        /** The set of expressions that define the identity for the child nodes.  This must match items in the DataViewScopeIdentity of those nodes. */
        childIdentityFields?: data.ISQExpr[];
    }

    export interface DataViewTreeNodeValue {
        value?: PrimitiveValue;
    }

    export interface DataViewTreeNodeMeasureValue extends DataViewTreeNodeValue, DataViewColumnAggregates {
        highlight?: PrimitiveValue;
    }

    export interface DataViewTreeNodeGroupValue extends DataViewTreeNodeValue {
        count?: PrimitiveValue;
    }

    export interface DataViewTable {
        columns: DataViewMetadataColumn[];

        identity?: DataViewScopeIdentity[];

        /** The set of expressions that define the identity for rows of the table.  This must match items in the DataViewScopeIdentity in the identity. */
        identityFields?: data.ISQExpr[];

        rows?: DataViewTableRow[];

        totals?: PrimitiveValue[];
    }

    export interface DataViewTableRow extends Array<PrimitiveValue> {
        /** The metadata repetition objects. */
        objects?: DataViewObjects[];
    }

    export interface DataViewMatrix {
        rows: DataViewHierarchy;
        columns: DataViewHierarchy;
        valueSources: DataViewMetadataColumn[];
    }

    export interface DataViewMatrixNode extends DataViewTreeNode {
        /** Indicates the level this node is on. Zero indicates the outermost children (root node level is undefined). */
        level?: number;

        children?: DataViewMatrixNode[];

         
        values?: { [id: number]: DataViewMatrixNodeValue };         

        /**
         * Indicates the source metadata index on the node's level. Its value is 0 if omitted.
         *
         * DEPRECATED: This property is deprecated and exists for backward-compatibility only.
         * New visuals code should consume the new property levelSourceIndex on DataViewMatrixGroupValue instead.
         */
        levelSourceIndex?: number;

        /**
         * The values of the particular group instance represented by this node.
         * This array property would contain more than one element in a composite group
         * (e.g. Year == 2016 and Month == 'January').
         */
        levelValues?: DataViewMatrixGroupValue[];

        /** Indicates whether or not the node is a subtotal node. Its value is false if omitted. */
        isSubtotal?: boolean;
    }

    /**
     * Represents a value at a particular level of a matrix's rows or columns hierarchy.
     * In the hierarchy level node is an instance of a composite group, this object will
     * be one of multiple values
     */
    export interface DataViewMatrixGroupValue extends DataViewTreeNodeValue {
        /**
         * Indicates the index of the corresponding column for this group level value 
         * (held by DataViewHierarchyLevel.sources).
         *
         * @example
         * // For example, to get the source column metadata of each level value at a particular row hierarchy node:
         * let matrixRowsHierarchy: DataViewHierarchy = dataView.matrix.rows;
         * let targetRowsHierarchyNode = <DataViewMatrixNode>matrixRowsHierarchy.root.children[0];
         * // Use the DataViewMatrixNode.level property to get the corresponding DataViewHierarchyLevel...
         * let targetRowsHierarchyLevel: DataViewHierarchyLevel = matrixRows.levels[targetRowsHierarchyNode.level];
         * for (let levelValue in rowsRootNode.levelValues) {
         *   // columnMetadata is the source column for the particular levelValue.value in this loop iteration
         *   let columnMetadata: DataViewMetadataColumn = 
         *     targetRowsHierarchyLevel.sources[levelValue.levelSourceIndex];
         * }
         */
        levelSourceIndex: number;
    }

    /** Represents a value at the matrix intersection, used in the values property on DataViewMatrixNode (inherited from DataViewTreeNode). */
    export interface DataViewMatrixNodeValue extends DataViewTreeNodeValue {
        highlight?: PrimitiveValue;

        /** Indicates the index of the corresponding measure (held by DataViewMatrix.valueSources). Its value is 0 if omitted. */
        valueSourceIndex?: number;
    }

    export interface DataViewHierarchy {
        root: DataViewMatrixNode;
        levels: DataViewHierarchyLevel[];
    }

    export interface DataViewHierarchyLevel {
        sources: DataViewMetadataColumn[];
    }

    export interface DataViewKpiColumnMetadata {
        graphic: string;

        // When false, five state KPIs are in: { -2, -1, 0, 1, 2 }. 
        // When true, five state KPIs are in: { -1, -0.5, 0, 0.5, 1 }.
        normalizedFiveStateKpiRange?: boolean;
    }

    export interface DataViewScriptResultData {
        payloadBase64: string;
    }
}???



declare module powerbi {
    /** Represents evaluated, named, custom objects in a DataView. */
    export interface DataViewObjects {
        [name: string]: DataViewObject;
    }

    /** Represents an object (name-value pairs) in a DataView. */
    export interface DataViewObject {
        /** Map of property name to property value. */
        [propertyName: string]: DataViewPropertyValue;

        /** Instances of this object. When there are multiple instances with the same object name they will appear here. */
        $instances?: DataViewObjectMap;
    }

    export interface DataViewObjectWithId {
        id: string;
        object: DataViewObject;
    }

    export interface DataViewObjectPropertyIdentifier {
        objectName: string;
        propertyName: string;
    }

    export type DataViewObjectMap = { [id: string]: DataViewObject };

    export type DataViewPropertyValue = PrimitiveValue | StructuralObjectValue;
}???



declare module powerbi.data {
    /** Defines a match against all instances of given roles. */
    export interface DataViewRoleWildcard {
        roles: string[];
        key: string;
    }
}???



declare module powerbi {
    /** Encapsulates the identity of a data scope in a DataView. */
    export interface DataViewScopeIdentity {
        /** Predicate expression that identifies the scope. */
        expr: data.ISQExpr;

        /** Key string that identifies the DataViewScopeIdentity to a string, which can be used for equality comparison. */
        key: string;
    }
}???



declare module powerbi.data {
    /** Defines a match against all instances of a given DataView scope. */
    export interface DataViewScopeWildcard {
        exprs: ISQExpr[];
        key: string;
    }
}???



declare module powerbi.data {
    import IStringResourceProvider = jsCommon.IStringResourceProvider;

    export type DisplayNameGetter = ((resourceProvider: IStringResourceProvider) => string) | string;
}???



declare module powerbi.data {
    /** Defines a selector for content, including data-, metadata, and user-defined repetition. */
    export interface Selector {
        /** Data-bound repetition selection. */
        data?: DataRepetitionSelector[];
	
        /** Metadata-bound repetition selection.  Refers to a DataViewMetadataColumn queryName. */
        metadata?: string;

        /** User-defined repetition selection. */
        id?: string;
    }

    export type DataRepetitionSelector = DataViewScopeIdentity | DataViewScopeWildcard | DataViewRoleWildcard; 
}???



declare module powerbi.data {
    //intentionally blank interfaces since this is not part of the public API

    export interface ISemanticFilter { }

    export interface ISQExpr { }

    export interface ISQConstantExpr extends ISQExpr { }

}???



declare module powerbi {
    export interface DefaultValueDefinition {
        value: data.ISQConstantExpr;
        identityFieldsValues?: data.ISQConstantExpr[];
    }

    export interface DefaultValueTypeDescriptor {
        defaultValue: boolean;
    }
}



declare module powerbi {
    import DisplayNameGetter = powerbi.data.DisplayNameGetter;

    export type EnumMemberValue = string | number;

    export interface IEnumMember {
        value: EnumMemberValue;
        displayName: DisplayNameGetter;
    }

    /** Defines a custom enumeration data type, and its values. */
    export interface IEnumType {
        /** Gets the members of the enumeration, limited to the validMembers, if appropriate. */
        members(validMembers?: EnumMemberValue[]): IEnumMember[];
    }
    
}???



declare module powerbi {
    export interface Fill {
        solid?: {
            color?: string;
        };
        gradient?: {
            startColor?: string;
            endColor?: string;
        };
        pattern?: {
            patternKind?: string;
            color?: string;
        };
    }

    export interface FillTypeDescriptor {
        solid?: {
            color?: FillSolidColorTypeDescriptor;
        };
        gradient?: {
            startColor?: boolean;
            endColor?: boolean;
        };
        pattern?: {
            patternKind?: boolean;
            color?: boolean;
        };
    }

    export type FillSolidColorTypeDescriptor = boolean | FillSolidColorAdvancedTypeDescriptor;

    export interface FillSolidColorAdvancedTypeDescriptor {
        /** Indicates whether the color value may be nullable, and a 'no fill' option is appropriate. */
        nullable: boolean;
    }  
}???



declare module powerbi {
    export interface FillRule extends FillRuleGeneric<string, number> {
    }

    export interface FillRuleTypeDescriptor {
    }

    export interface FillRuleGeneric<TColor, TValue> {
        linearGradient2?: LinearGradient2Generic<TColor, TValue>;
        linearGradient3?: LinearGradient3Generic<TColor, TValue>;

        // stepped2?
        // ...
    }

    export interface LinearGradient2Generic<TColor, TValue> {
        max: RuleColorStopGeneric<TColor, TValue>;
        min: RuleColorStopGeneric<TColor, TValue>;
    }

    export interface LinearGradient3Generic<TColor, TValue> {
        max: RuleColorStopGeneric<TColor, TValue>;
        mid: RuleColorStopGeneric<TColor, TValue>;
        min: RuleColorStopGeneric<TColor, TValue>;
    }

    export interface RuleColorStopGeneric<TColor, TValue> {
        color: TColor;
        value?: TValue;
    }
}???



declare module powerbi {
    export interface FilterTypeDescriptor {
        selfFilter?: boolean;
    }
}???

declare module powerbi {
    export type GeoJson = GeoJsonDefinitionGeneric<string>;

    export interface GeoJsonDefinitionGeneric<T> {
        type: T;
        name: T;
        content: T;
    }

    export interface GeoJsonTypeDescriptor { }
}???



declare module powerbi {
    export type ImageValue = ImageDefinitionGeneric<string>;

    export interface ImageDefinitionGeneric<T> {
        name: T;
        url: T;
        scaling?: T;
    }

    export interface ImageTypeDescriptor { }

}???



declare module powerbi {
    export type Paragraphs = Paragraph[];
    export interface Paragraph {
        horizontalTextAlignment?: string;
        textRuns: TextRun[];
    }

    export interface ParagraphsTypeDescriptor {
    }

    export interface TextRunStyle {
        fontFamily?: string;
        fontSize?: string;
        fontStyle?: string;
        fontWeight?: string;
        textDecoration?: string;
    }

    export interface TextRun {
        textStyle?: TextRunStyle;
        url?: string;
        value: string;
    }
}???



declare module powerbi {
    import SemanticFilter = data.ISemanticFilter;

    /** Defines instances of structural types. */
    export type StructuralObjectValue =
        Fill |
        FillRule |
        SemanticFilter |
        DefaultValueDefinition |
        ImageValue |
        Paragraphs |
        GeoJson;
    
    /** Describes a structural type in the client type system. Leaf properties should use ValueType. */
    export interface StructuralTypeDescriptor {
        fill?: FillTypeDescriptor;
        fillRule?: FillRuleTypeDescriptor;
        filter?: FilterTypeDescriptor;
        expression?: DefaultValueTypeDescriptor;
        image?: ImageTypeDescriptor;
        paragraphs?: ParagraphsTypeDescriptor;
        geoJson?: GeoJsonTypeDescriptor;

        //border?: BorderTypeDescriptor;
        //etc.
    }
}???



declare module powerbi {
    /** Describes a data value type in the client type system. Can be used to get a concrete ValueType instance. */
    export interface ValueTypeDescriptor {
        // Simplified primitive types
        text?: boolean;
        numeric?: boolean;
        integer?: boolean;
        bool?: boolean;
        dateTime?: boolean;
        duration?: boolean;
        binary?: boolean;
        none?: boolean; //TODO: 5005022 remove none type when we introduce property categories.

        // Extended types
        temporal?: TemporalTypeDescriptor;
        geography?: GeographyTypeDescriptor;
        misc?: MiscellaneousTypeDescriptor;
        formatting?: FormattingTypeDescriptor;
        enumeration?: IEnumType;
        scripting?: ScriptTypeDescriptor;
        operations?: OperationalTypeDescriptor;
    }

    export interface ScriptTypeDescriptor {
        source?: boolean;
    }

    export interface TemporalTypeDescriptor {
        year?: boolean;
        quarter?: boolean;
        month?: boolean;
        day?: boolean;
        paddedDateTableDate?: boolean;
    }

    export interface GeographyTypeDescriptor {
        address?: boolean;
        city?: boolean;
        continent?: boolean;
        country?: boolean;
        county?: boolean;
        region?: boolean;
        postalCode?: boolean;
        stateOrProvince?: boolean;
        place?: boolean;
        latitude?: boolean;
        longitude?: boolean;
    }

    export interface MiscellaneousTypeDescriptor {
        image?: boolean;
        imageUrl?: boolean;
        webUrl?: boolean;
        barcode?: boolean;
    }

    export interface FormattingTypeDescriptor {
        color?: boolean;
        formatString?: boolean;
        alignment?: boolean;
        labelDisplayUnits?: boolean;
        fontSize?: boolean;
        labelDensity?: boolean;
    }

    export interface OperationalTypeDescriptor {
        searchEnabled?: boolean;
    }

    /** Describes instances of value type objects. */
    export type PrimitiveValue = string | number | boolean | Date;
}???



declare module powerbi {
    export interface IViewport {
        height: number;
        width: number;
    }
}???



declare module powerbi {
    import Selector = powerbi.data.Selector;
    
    export interface VisualObjectInstance {
        /** The name of the object (as defined in VisualCapabilities). */
        objectName: string;

        /** A display name for the object instance. */
        displayName?: string;

        /** The set of property values for this object.  Some of these properties may be defaults provided by the IVisual. */
        properties: {
            [propertyName: string]: DataViewPropertyValue;
        };

        /** The selector that identifies this object. */
        selector: Selector;

        /** Defines the constrained set of valid values for a property. */
        validValues?: {
            [propertyName: string]: string[];
        };

        /** (Optional) VisualObjectInstanceEnumeration category index. */
        containerIdx?: number;
    }

    export type VisualObjectInstanceEnumeration = VisualObjectInstance[] | VisualObjectInstanceEnumerationObject;

    export interface VisualObjectInstanceEnumerationObject {
        /** The visual object instances. */
        instances: VisualObjectInstance[];

        /** Defines a set of containers for related object instances. */
        containers?: VisualObjectInstanceContainer[];
    }

    export interface VisualObjectInstanceContainer {
        displayName: data.DisplayNameGetter;
    }

    export interface VisualObjectInstancesToPersist {
        /** Instances which should be merged with existing instances. */
        merge?: VisualObjectInstance[];

        /** Instances which should replace existing instances. */
        replace?: VisualObjectInstance[];

        /** Instances which should be deleted from the existing instances. */
        remove?: VisualObjectInstance[];

        /** Instances which should be deleted from the existing objects. */
        removeObject?: VisualObjectInstance[];
    }
    
    export interface EnumerateVisualObjectInstancesOptions {
        objectName: string;
    }
}




declare module powerbi {
    import Selector = powerbi.data.Selector;

    export interface VisualObjectRepetition {
        /** The selector that identifies the objects. */
        selector: Selector;

        /** The set of repetition descriptors for this object. */
        objects: {
            [objectName: string]: DataViewRepetitionObjectDescriptor;
        };
    }

    export interface DataViewRepetitionObjectDescriptor {
        /** Properties used for formatting (e.g., Conditional Formatting). */
        formattingProperties?: string[];
    }
}
???



declare module powerbi.extensibility {

    export interface IVisualPluginOptions {
        transform?: IVisualDataViewTransform;
    }

    export interface IVisualConstructor {
        __transform__?: IVisualDataViewTransform;
    }   
    
    export interface IVisualDataViewTransform {
        <T>(dataview: DataView[]): T;
    } 

    // These are the base interfaces. These should remain empty
    // All visual versions should extend these for type compatability

    export interface IVisual { }

    export interface IVisualHost { }

    export interface VisualUpdateOptions { }

    export interface VisualConstructorOptions { }
}




declare module powerbi {
    export interface IColorInfo extends IStyleInfo {
        value: string;
    }

    export interface IStyleInfo {
        className?: string;
    }
}



declare module powerbi.extensibility {
    interface ISelectionManager {
        select(selectionId: ISelectionId | ISelectionId[], multiSelect?: boolean): IPromise<ISelectionId[]>;
        hasSelection(): boolean;
        clear(): IPromise<{}>;
        getSelectionIds(): ISelectionId[];
    }
}



declare module powerbi.extensibility {
    export interface ISelectionId { }

    export interface ISelectionIdBuilder {
        withCategory(categoryColumn: DataViewCategoryColumn, index: number): this;
        withSeries(seriesColumn: DataViewValueColumns, valueColumn: DataViewValueColumn | DataViewValueColumnGroup): this;
        withMeasure(measureId: string): this;
        createSelectionId(): ISelectionId;
    }

    function VisualPlugin (options: IVisualPluginOptions): ClassDecorator;
}




declare module powerbi.extensibility {
    export interface IColorPalette {
        getColor(key: string): IColorInfo;
    }
}

/**
 * Change Log Version 1.2.0
 */



declare module powerbi.extensibility.visual {
    /**
     * Represents a visualization displayed within an application (PowerBI dashboards, ad-hoc reporting, etc.).
     * This interface does not make assumptions about the underlying JS/HTML constructs the visual uses to render itself.
     */
    export interface IVisual extends extensibility.IVisual {
        /** Notifies the IVisual of an update (data, viewmode, size change). */
        update<T>(options: VisualUpdateOptions, viewModel?: T): void;

        /** Notifies the visual that it is being destroyed, and to do any cleanup necessary (such as unsubscribing event handlers). */
        destroy?(): void;

        /** Gets the set of objects that the visual is currently displaying. */
        enumerateObjectInstances?(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
    }

    export interface IVisualHost extends extensibility.IVisualHost {
        createSelectionIdBuilder: () => visuals.ISelectionIdBuilder;
        createSelectionManager: () => ISelectionManager;
        colorPalette: IColorPalette;
        persistProperties: (changes: VisualObjectInstancesToPersist) => void;
    }

    export interface VisualUpdateOptions extends extensibility.VisualUpdateOptions {
        viewport: IViewport;
        dataViews: DataView[];
        type: VisualUpdateType;
        viewMode?: ViewMode;
    }

    export interface VisualConstructorOptions extends extensibility.VisualConstructorOptions {
        element: HTMLElement;
        host: IVisualHost;
    }
}

